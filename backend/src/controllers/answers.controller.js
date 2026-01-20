import supabase from "../config/supabase.js";

export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;

    const userId = req.user.id;

    if (!questionId || !content) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (content.length < 10) {
      return res.status(400).json({ message: "Answer too short" });
    }

    const { data: question } = await supabase
      .from("questions")
      .select("id")
      .eq("id", questionId)
      .single();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const { data, error } = await supabase
      .from("answers")
      .insert([
        {
          question_id: questionId,
          content,
          author_id: userId,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to create answer",
      error: err.message,
    });
  }
};
