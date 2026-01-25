import supabase from "../config/supabase.js";

export const getMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Profile
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, username, email, reputation, created_at")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Counts
    const [{ count: questionCount }, { count: answerCount }] =
      await Promise.all([
        supabase
          .from("questions")
          .select("*", { count: "exact", head: true })
          .eq("author_id", userId),

        supabase
          .from("answers")
          .select("*", { count: "exact", head: true })
          .eq("author_id", userId),
      ]);

    res.json({
      ...profile,
      questions_count: questionCount ?? 0,
      answers_count: answerCount ?? 0,
    });
  } catch (err) {
    console.error("Account error:", err);
    res.status(500).json({ message: err.message });
  }
};
