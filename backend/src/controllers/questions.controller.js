import supabase from "../config/supabase.js";

export const getAllQuestions = async (req, res) => {
  try {
    const { data, error } = await supabase
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
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * POST /questions/create
 */
export const createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;

    // TEMP until auth is wired
    const userId = req.user?.id || "TEMP_USER_ID";

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

/**
 * GET /questions/:id
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

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

    const { data: answers, error: aError } = await supabase
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
        )
      `,
      )
      .eq("question_id", id)
      .order("is_accepted", { ascending: false })
      .order("created_at", { ascending: false });

    if (aError) throw aError;

    res.status(200).json({ question, answers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
