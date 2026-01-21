import supabase from "../config/supabase.js";
import {
  applyAnswerAccepted,
  revertAnswerUpvote,
} from "../services/reputation.service.js";

export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user?.id || "TEMP_USER_ID";

    if (!questionId || !content) {
      return res.status(400).json({ message: "Missing fields" });
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
      .insert({
        question_id: questionId,
        content,
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
 * POST /answers/:answerId/accept
 */
export const acceptAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answerId } = req.params;

    const { data: answer } = await supabase
      .from("answers")
      .select("id, author_id, question_id")
      .eq("id", answerId)
      .single();

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const { data: question } = await supabase
      .from("questions")
      .select("author_id")
      .eq("id", answer.question_id)
      .single();

    if (question.author_id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const { data: existingAccepted } = await supabase
      .from("answers")
      .select("id, author_id")
      .eq("question_id", answer.question_id)
      .eq("is_accepted", true)
      .single();

    if (existingAccepted) {
      await supabase
        .from("answers")
        .update({ is_accepted: false })
        .eq("id", existingAccepted.id);

      await revertAnswerUpvote(existingAccepted.author_id);
    }

    await supabase
      .from("answers")
      .update({ is_accepted: true })
      .eq("id", answer.id);

    await applyAnswerAccepted(answer.author_id);

    res.json({ message: "Answer accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
