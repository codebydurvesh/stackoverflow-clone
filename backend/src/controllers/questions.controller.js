import supabase from "../config/supabase.js";
import { moderateQuestion } from "../services/aiModeration.service.js";

export const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "newest";
    const tagsParam = req.query.tags || req.query.tag;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let questionIds = null;

    // Tag filtering
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

    let query = supabase.from("questions").select(
      `
        id,
        title,
        description,
        created_at,
        users ( id, username, avatar_url ),
        votes ( vote_value )
        `,
      { count: "exact" },
    );

    if (questionIds) query = query.in("id", questionIds);

    if (sort === "oldest") {
      query = query.order("created_at", { ascending: true });
    } else if (sort === "votes") {
      query = query.order("votes(vote_value)", {
        ascending: false,
        nullsFirst: false,
      });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const { data, count } = await query.range(from, to);

    const formatted = data.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      created_at: q.created_at,
      score: q.votes?.reduce((s, v) => s + v.vote_value, 0) || 0,
      user: q.users,
    }));

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
    // const moderationResult = await moderateQuestion({ title, description });
    // console.log("Moderation Result:", moderationResult);

    // if (moderationResult.decision === "BLOCK") {
    //   return res.status(400).json({
    //     message: "Question blocked by AI moderation",
    //     reason: moderationResult.reason,
    //   });
    // }

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

    const { data: question } = await supabase
      .from("questions")
      .select(
        `
        id,
        title,
        description,
        created_at,
        users ( id, username, avatar_url )
        `,
      )
      .eq("id", id)
      .single();

    if (!question)
      return res.status(404).json({ message: "Question not found" });

    let answersQuery = supabase
      .from("answers")
      .select(
        `
        id,
        content,
        is_accepted,
        created_at,
        users ( id, username, avatar_url ),
        votes ( vote_value )
        `,
        { count: "exact" },
      )
      .eq("question_id", id)
      .order("is_accepted", { ascending: false });

    if (sort === "oldest") {
      answersQuery = answersQuery.order("created_at", { ascending: true });
    } else if (sort === "votes") {
      answersQuery = answersQuery.order("votes(vote_value)", {
        ascending: false,
      });
    } else {
      answersQuery = answersQuery.order("created_at", { ascending: false });
    }

    const { data: answers, count } = await answersQuery.range(from, to);

    const formattedAnswers = answers.map((a) => ({
      id: a.id,
      content: a.content,
      is_accepted: a.is_accepted,
      created_at: a.created_at,
      score: a.votes?.reduce((s, v) => s + v.vote_value, 0) || 0,
      user: a.users,
    }));

    res.json({
      question,
      answers: formattedAnswers,
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
