import supabase from "../config/supabase.js";

const createQuestion = async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    throw new Error("Title and description are required to create a question.");
  }
  userId = req.user.id;
  supabase.from("questions").insert({
    title,
    description,
    author_id: userId,
  });
  return res.status(201).json({ message: "Question created successfully." });
};

const getAllQuestions = async (req, res) => {
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

    if (error) {
      throw new Error(error.message);
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export { createQuestion, getAllQuestions };
