import supabase from "../config/supabase.js";
import { moderateQuestion } from "../services/aiModeration.service.js";

export const getAllQuestions = async (req, res) => {
  try {
    const search = req.query.search || null;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "newest";
    const tagsParam = req.query.tags || null;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let questionIds = null;

    /* ---------- TAG FILTERING ---------- */
    if (tagsParam) {
      const tagNames = tagsParam.split(",").map((t) => t.trim().toLowerCase());

      const { data: tags } = await supabase
        .from("tags")
        .select("id")
        .in("name", tagNames);

      if (!tags?.length) {
        return res.json({
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }

      const tagIds = tags.map((t) => t.id);

      const { data: qTags } = await supabase
        .from("question_tags")
        .select("question_id")
        .in("tag_id", tagIds);

      questionIds = [...new Set(qTags.map((q) => q.question_id))];

      if (!questionIds.length) {
        return res.json({
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }
    }

    /* ---------- FETCH QUESTIONS ---------- */
    let query = supabase
      .from("questions")
      .select(
        `
    id,
    title,
    description,
    created_at,
    users ( id, username ),
    answers ( id, is_accepted )
  `,
        { count: "exact" },
      )
      .range(from, to);

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (questionIds) query = query.in("id", questionIds);

    query =
      sort === "oldest"
        ? query.order("created_at", { ascending: true })
        : query.order("created_at", { ascending: false });

    const { data: questions, count, error } = await query;

    if (error) throw error;

    if (!questions?.length) {
      return res.json({
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      });
    }

    /* ---------- FETCH VOTES ---------- */
    const questionIdsOnly = questions.map((q) => q.id);

    const { data: votes } = await supabase
      .from("votes")
      .select("target_id, vote_value")
      .eq("target_type", "question")
      .in("target_id", questionIdsOnly);

    const voteMap = {};
    votes?.forEach((v) => {
      voteMap[v.target_id] = (voteMap[v.target_id] || 0) + v.vote_value;
    });

    /* ---------- FORMAT RESPONSE ---------- */
    let formatted = questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      created_at: q.created_at,
      vote_count: voteMap[q.id] || 0,
      has_accepted_answer: q.answers?.some((a) => a.is_accepted) || false,
      user: q.users || { username: "Unknown" },
    }));

    /* ---------- SORT BY VOTES ---------- */
    if (sort === "votes") {
      formatted = formatted.sort((a, b) => b.vote_count - a.vote_count);
    }

    res.json({
      data: formatted,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    console.error("Error in getAllQuestions:", err);
    res.status(500).json({ message: err.message });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const { title, description, tags = [] } = req.body;
    const userId = req.user.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized, req.user.id missing" });
    }

    if (!title || !description || !tags.length) {
      return res
        .status(400)
        .json({ message: "Title, description & tags required" });
    }

    // Ai Moderation
    const moderationResult = await moderateQuestion({ title, description });
    console.log("Moderation Result:", moderationResult);

    if (moderationResult.decision === "BLOCK") {
      return res.status(400).json({
        message: "Question blocked by AI moderation",
        reason: moderationResult.reason,
      });
    }

    const { data: question, error: questionError } = await supabase
      .from("questions")
      .insert({ title, description, author_id: userId })
      .select()
      .single();

    if (questionError) {
      console.error("Question insert error:", questionError);
      return res.status(500).json({ message: questionError.message });
    }
    if (!question) {
      return res.status(500).json({ message: "Failed to create question." });
    }

    // attach tags
    const { data: tagRows, error: tagError } = await supabase
      .from("tags")
      .select("id")
      .in(
        "name",
        tags.map((t) => t.toLowerCase()),
      );
    console.log(
      "Requested Tags:",
      tags.map((t) => t.toLowerCase()),
    );
    console.log("Fetched Tag Rows:", tagRows);
    if (tagError) {
      console.error("Tag select error:", tagError);
      return res.status(500).json({ message: tagError.message });
    }
    if (!tagRows || !tagRows.length) {
      return res.status(400).json({ message: "Some or all tags not found." });
    }

    const questionTags = tagRows.map((t) => ({
      question_id: question.id,
      tag_id: t.id,
    }));

    await supabase.from("question_tags").insert(questionTags);

    res.status(201).json(question);
  } catch (err) {
    res.status(500).json({ "Questions Create Error": err.message });
  }
};

export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || "newest";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: question, error } = await supabase
      .from("questions")
      .select(
        `
        id,
        title,
        description,
        created_at,
        votes ( vote_value ),
        users ( id, username, avatar_url )
        `,
      )
      .eq("id", id)
      .single();

    if (error || !question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // ✅ TOTAL VOTES
    const vote_count = Array.isArray(question.votes)
      ? question.votes.reduce((s, v) => s + v.vote_value, 0)
      : 0;

    delete question.votes;

    // ✅ USER VOTE (AUTH-AWARE)
    let user_vote = null;

    if (req.user?.id) {
      const { data: voteRow } = await supabase
        .from("votes")
        .select("vote_value")
        .eq("target_id", id)
        .eq("target_type", "question")
        .eq("user_id", req.user.id)
        .single();

      user_vote = voteRow?.vote_value ?? null;
    }

    // ANSWERS
    let answersQuery = supabase
      .from("answers")
      .select(
        `
        id,
        content,
        is_accepted,
        created_at,
        users ( id, username, avatar_url )
        `,
        { count: "exact" },
      )
      .eq("question_id", id)
      .eq("is_accepted", true)
      .order("is_accepted", { ascending: false });

    if (sort === "oldest") {
      answersQuery = answersQuery.order("created_at", { ascending: true });
    } else {
      answersQuery = answersQuery.order("created_at", { ascending: false });
    }

    const { data: answers, count } = await answersQuery.range(from, to);

    res.json({
      question,
      vote_count,
      user_vote,
      answers,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
