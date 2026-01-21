import supabase from "../config/supabase.js";

export const getAllQuestions = async (req, res) => {
  try {
    const { id } = req.params;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort || "newest";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Fetch question
    const { data: question, error: qError } = await supabase
      .from("questions")
      .select(
        `
        id,
        title,
        description,
        created_at,
        users (
          id,
          username,
          avatar_url
        )
        `,
      )
      .eq("id", id)
      .single();

    if (qError || !question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Build answers query
    let answersQuery = supabase
      .from("answers")
      .select(
        `
        id,
        content,
        is_accepted,
        created_at,
        users (
          id,
          username,
          avatar_url
        ),
        votes ( vote_value )
        `,
        { count: "exact" },
      )
      .eq("question_id", id)
      .order("is_accepted", { ascending: false });

    //  Sorting logic
    if (sort === "oldest") {
      answersQuery = answersQuery.order("created_at", { ascending: true });
    } else if (sort === "votes") {
      answersQuery = answersQuery.order("votes(vote_value)", {
        ascending: false,
        nullsFirst: false,
      });
    } else {
      // newest (default)
      answersQuery = answersQuery.order("created_at", { ascending: false });
    }

    //  Pagination
    const {
      data: answers,
      error: aError,
      count,
    } = await answersQuery.range(from, to);

    if (aError) throw aError;

    res.status(200).json({
      question,
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

export const createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !description) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("questions")
      .insert({
        title,
        description,
        author_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

    // Fetch question
    const { data: question, error: qError } = await supabase
      .from("questions")
      .select(
        `
        id,
        title,
        description,
        created_at,
        users (
          id,
          username,
          avatar_url
        )
        `,
      )
      .eq("id", id)
      .single();

    if (qError || !question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Build answers query
    let answersQuery = supabase
      .from("answers")
      .select(
        `
        id,
        content,
        is_accepted,
        created_at,
        users (
          id,
          username,
          avatar_url
        ),
        votes ( vote_value )
        `,
        { count: "exact" },
      )
      .eq("question_id", id)
      .order("is_accepted", { ascending: false });

    // Sorting logic
    if (sort === "oldest") {
      answersQuery = answersQuery.order("created_at", { ascending: true });
    } else if (sort === "votes") {
      answersQuery = answersQuery.order("votes(vote_value)", {
        ascending: false,
        nullsFirst: false,
      });
    } else {
      // newest (default)
      answersQuery = answersQuery.order("created_at", { ascending: false });
    }

    //  Pagination
    const {
      data: answers,
      error: aError,
      count,
    } = await answersQuery.range(from, to);

    if (aError) throw aError;

    // compute answer scores
    const formattedAnswers = answers.map((answer) => {
      const score =
        answer.votes?.reduce((sum, vote) => sum + vote.vote_value, 0) || 0;

      return {
        id: answer.id,
        content: answer.content,
        is_accepted: answer.is_accepted,
        created_at: answer.created_at,
        score,
        user: answer.users,
      };
    });

    // Final response
    res.status(200).json({
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
