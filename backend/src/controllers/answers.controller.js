import supabase from "../config/supabase.js";

const createAnswer = async (req, res) => {
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

const acceptAnswer = async (req, res) => {
  try {
    const { id: answerId } = req.params;
    const userId = req.user.id;
    const { data: answer } = await supabase
      .from("answers")
      .select("id, question_id")
      .eq("id", answerId)
      .single();

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const { data: question } = await supabase
      .from("questions")
      .select("id, author_id")
      .eq("id", answer.question_id)
      .single();

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author_id !== userId) {
      return res
        .status(403)
        .json({ message: "Only the question author can accept an answer" });
    }

    await supabase
      .from("answers")
      .update({ is_accepted: false })
      .eq("question_id", question.id);

    await supabase
      .from("answers")
      .update({ is_accepted: true })
      .eq("id", answerId);

    await supabase
      .from("questions")
      .update({ accepted_answer_id: answerId })
      .eq("id", question.id);

    return res.status(200).json({ message: "Answer accepted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to accept answer", error: error.message });
  }
};

export { createAnswer, acceptAnswer };
