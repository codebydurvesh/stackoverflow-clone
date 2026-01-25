import supabase from "../config/supabase.js";
import {
  applyQuestionUpvote,
  revertQuestionUpvote,
  applyQuestionDownvote,
} from "../services/reputation.service.js";
export const castVote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { questionId, type } = req.body;

    if (!["up", "down"].includes(type)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    const { data: question } = await supabase
      .from("questions")
      .select("author_id")
      .eq("id", questionId)
      .single();

    if (question.author_id === userId) {
      return res.status(403).json({ message: "Cannot vote on own question" });
    }

    const { data: existing } = await supabase
      .from("votes")
      .select("id, vote_value")
      .eq("user_id", userId)
      .eq("question_id", questionId)
      .eq("target_type", "question")
      .single();

    const voteValue = type === "up" ? 1 : -1;

    if (existing && existing.vote_value === voteValue) {
      await supabase.from("votes").delete().eq("id", existing.id);
      if (type === "up") await revertQuestionUpvote(question.author_id);
      return res.json({ message: "Vote removed" });
    }

    if (existing) {
      await supabase
        .from("votes")
        .update({ vote_value: voteValue })
        .eq("id", existing.id);
      if (existing.vote_value === 1)
        await revertQuestionUpvote(question.author_id);
    } else {
      const { data: insertData, error: insertError } = await supabase
        .from("votes")
        .upsert(
          {
            user_id: userId,
            target_id: questionId,
            target_type: "question",
            vote_value: voteValue,
          },
          {
            onConflict: "user_id,target_id,target_type",
          },
        );

      console.log("Vote insert data:", insertData);
      console.log("Vote insert error:", insertError);

      if (insertError) {
        return res.status(500).json({ message: insertError.message });
      }
    }

    if (type === "up") await applyQuestionUpvote(question.author_id);
    if (type === "down") await applyQuestionDownvote(question.author_id);

    res.json({ message: "Vote applied" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
