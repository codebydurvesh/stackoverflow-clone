import supabase from "../config/supabaseClient.js";

export const castVote = async (req, res) => {
  try {
    const { targetId, targetType, voteValue } = req.body;

    const userId = req.user.id;

    // 1) Validate input
    if (!targetId || !targetType || ![1, -1].includes(voteValue)) {
      return res.status(400).json({ message: "Invalid vote payload" });
    }
    if (!["question", "answer"].includes(targetType)) {
      return res.status(400).json({ message: "Invalid targetType" });
    }

    // 2) Fetch target & prevent self-vote
    const table = targetType === "question" ? "questions" : "answers";
    const { data: target, error: tErr } = await supabase
      .from(table)
      .select("id, author_id")
      .eq("id", targetId)
      .single();

    if (tErr || !target) {
      return res.status(404).json({ message: `${targetType} not found` });
    }
    if (target.author_id === userId) {
      return res.status(403).json({ message: "Cannot vote on own content" });
    }

    // 3) Check existing vote
    const { data: existingVote } = await supabase
      .from("votes")
      .select("id, vote_value")
      .eq("user_id", userId)
      .eq("target_id", targetId)
      .eq("target_type", targetType)
      .maybeSingle();

    // 4) Toggle logic
    // Case A: No existing vote > insert
    if (!existingVote) {
      const { error } = await supabase.from("votes").insert({
        user_id: userId,
        target_id: targetId,
        target_type: targetType,
        vote_value: voteValue,
      });
      if (error) throw error;
      return res.status(201).json({ message: "Vote added" });
    }

    // Case B: Same vote > remove
    if (existingVote.vote_value === voteValue) {
      const { error } = await supabase
        .from("votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) throw error;
      return res.status(200).json({ message: "Vote removed" });
    }

    // Case C: Opposite vote > replace (delete + insert)
    const { error: delErr } = await supabase
      .from("votes")
      .delete()
      .eq("id", existingVote.id);
    if (delErr) throw delErr;

    const { error: insErr } = await supabase.from("votes").insert({
      user_id: userId,
      target_id: targetId,
      target_type: targetType,
      vote_value: voteValue,
    });
    if (insErr) throw insErr;

    return res.status(200).json({ message: "Vote updated" });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to cast vote",
      error: err.message,
    });
  }
};
