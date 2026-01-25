import supabase from "../config/supabase.js";

export const getMyNotifications = async (req, res) => {
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      id,
      created_at,
      is_read,
      answers (
        id,
        content,
        users ( username )
      ),
      questions (
        id,
        title
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });

  res.json(data);
};

export const getNotificationDetails = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const { data, error } = await supabase
    .from("notifications")
    .select(
      `
      id,
      answers (
        id,
        content,
        is_accepted,
        users ( username )
      ),
      questions (
        id,
        title,
        description
      )
    `,
    )
    .eq("id", id)
    .eq("user_id", userId)
    .eq("is_read", false)
    .single();

  if (error) return res.status(404).json({ message: "Not found" });

  // mark as read
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);

  res.json(data);
};
