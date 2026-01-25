import supabase from "../config/supabase.js";

export const incrementUserReputation = async (userId, delta) => {
  const { error } = await supabase.rpc("increment_reputation", {
    user_id_input: userId,
    delta_input: delta,
  });

  if (error) {
    throw new Error(`Reputation update failed: ${error.message}`);
  }
};

export const applyAnswerUpvote = async (authorId) => {
  await incrementUserReputation(authorId, +10);
};

export const revertAnswerUpvote = async (authorId) => {
  await incrementUserReputation(authorId, -10);
};

export const applyAnswerDownvote = async (authorId) => {
  await incrementUserReputation(authorId, -2);
};

export const applyAnswerAccepted = async (authorId) => {
  await incrementUserReputation(authorId, +15);
};
export const applyQuestionUpvote = async (authorId) => {
  await incrementUserReputation(authorId, +10);
};

export const revertQuestionUpvote = async (authorId) => {
  await incrementUserReputation(authorId, -10);
};

export const applyQuestionDownvote = async (authorId) => {
  await incrementUserReputation(authorId, -2);
};

export const applyQuestionAccepted = async (authorId) => {
  await incrementUserReputation(authorId, +15);
};
