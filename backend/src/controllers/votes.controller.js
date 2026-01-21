import supabase from "../config/supabase.js";
import {
  applyAnswerUpvote,
  revertAnswerUpvote,
  applyAnswerDownvote,
} from "../services/reputation.service.js";

const castVote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { answerId, type } = req.body;

    if (!["up", "down"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    // 1. Get answer author
    const { data: answer, error: answerError } = await supabase
      .from("answers")
      .select("author_id")
      .eq("id", answerId)
      .single();

    if (answerError) throw answerError;

    if (answer.author_id === userId) {
      return res
        .status(403)
        .json({ message: "Cannot vote on your own answer" });
    }

    // 2. Check existing vote
    const { data: existingVote } = await supabase
      .from("votes")
      .select("*")
      .eq("user_id", userId)
      .eq("answer_id", answerId)
      .single();

    // 3. Same vote → remove
    if (existingVote && existingVote.type === type) {
      await supabase.from("votes").delete().eq("id", existingVote.id);

      if (type === "up") {
        await revertAnswerUpvote(answer.author_id);
      }

      return res.json({ message: "Vote removed" });
    }

    // 4. Change vote
    if (existingVote) {
      await supabase.from("votes").update({ type }).eq("id", existingVote.id);

      if (existingVote.type === "up") {
        await revertAnswerUpvote(answer.author_id);
      }
      if (type === "up") {
        await applyAnswerUpvote(answer.author_id);
      }
      if (type === "down") {
        await applyAnswerDownvote(answer.author_id);
      }

      return res.json({ message: "Vote updated" });
    }

    // 5. New vote
    await supabase.from("votes").insert({
      user_id: userId,
      answer_id: answerId,
      type,
    });

    if (type === "up") {
      await applyAnswerUpvote(answer.author_id);
    }
    if (type === "down") {
      await applyAnswerDownvote(answer.author_id);
    }

    res.status(201).json({ message: "Vote added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Voting failed" });
  }
};
export { castVote };
