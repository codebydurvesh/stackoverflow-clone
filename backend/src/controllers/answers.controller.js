import supabase from "../config/supabase.js";
import {
  applyAnswerAccepted,
  revertAnswerUpvote,
} from "../services/reputation.service.js";

/**
 * CREATE ANSWER
 * - Logged-in users only
 * - Cannot answer own question
 */
export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user.id;

    // 1. Get question author
    const { data: question } = await supabase
      .from("questions")
      .select("author_id")
      .eq("id", questionId)
      .single();

    // Prevent author answering own question
    if (question.author_id === userId) {
      return res.status(403).json({
        message: "You cannot answer your own question",
      });
    }

    // 2. Insert answer
    const { data: answer, error } = await supabase
      .from("answers")
      .insert({
        question_id: questionId,
        content,
        author_id: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // 3. CREATE NOTIFICATION 🔔
    await supabase.from("notifications").insert({
      user_id: question.author_id, // question author
      answer_id: answer.id,
      question_id: questionId,
    });

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ACCEPT ANSWER
 * - Only question author
 * - Only one accepted answer
 * - Reputation handled
 */
export const acceptAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: answerId } = req.params;

    // Fetch answer
    const { data: answer, error: aErr } = await supabase
      .from("answers")
      .select("id, author_id, question_id")
      .eq("id", answerId)
      .single();

    if (aErr || !answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    // Fetch question
    const { data: question } = await supabase
      .from("questions")
      .select("author_id")
      .eq("id", answer.question_id)
      .single();

    // Only question author can accept
    if (question.author_id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Unaccept existing accepted answer (if any)
    const { data: existing } = await supabase
      .from("answers")
      .select("id, author_id")
      .eq("question_id", answer.question_id)
      .eq("is_accepted", true)
      .single();

    if (existing) {
      await supabase
        .from("answers")
        .update({ is_accepted: false })
        .eq("id", existing.id);

      await revertAnswerUpvote(existing.author_id);
    }

    // Accept new answer
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

export const deleteAnswer = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data: answer } = await supabase
      .from("answers")
      .select("id, question_id")
      .eq("id", id)
      .single();

    const { data: question } = await supabase
      .from("questions")
      .select("author_id")
      .eq("id", answer.question_id)
      .single();

    if (question.author_id !== userId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await supabase.from("answers").delete().eq("id", id);

    res.json({ message: "Answer rejected and deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
