import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { supabase } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const QuestionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [voteCount, setVoteCount] = useState(0);
  const [userVote, setUserVote] = useState(null);
  const [voting, setVoting] = useState(false);

  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return new Date(date).toLocaleDateString();
  };

  // FETCH QUESTION (WITH AUTH HEADER)
  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);

      const { data: session } = await supabase.auth.getSession();

      const res = await axios.get(`${apiUrl}/questions/details/${id}`, {
        headers: session?.session?.access_token
          ? {
              Authorization: `Bearer ${session.session.access_token}`,
            }
          : {},
      });

      setQuestionData(res.data);
      setVoteCount(res.data.vote_count || 0);
      setUserVote(res.data.user_vote ?? null);
      setLoading(false);
    };

    fetchQuestionDetails();
  }, [id]);

  //  HANDLE VOTE (OPTIMISTIC + SAFE)
  const handleVote = async (type) => {
    if (voting) return;

    const delta =
      type === "up"
        ? userVote === 1
          ? -1
          : userVote === -1
            ? 2
            : 1
        : userVote === -1
          ? 1
          : userVote === 1
            ? -2
            : -1;

    const prevVote = userVote;
    setVoteCount((v) => v + delta);
    setUserVote(type === "up" ? 1 : -1);
    setVoting(true);

    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.access_token) {
        throw new Error("Not authenticated");
      }

      await axios.post(
        `${apiUrl}/votes/vote`,
        { questionId: id, type },
        {
          headers: {
            Authorization: `Bearer ${session.session.access_token}`,
          },
        },
      );
    } catch (err) {
      // rollback on error
      setVoteCount((v) => v - delta);
      setUserVote(prevVote);
      alert(err.response?.data?.message || "You have to login to vote.");
      navigate("/login");
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex justify-center mt-12">Loading Question...</div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-6 mt-5">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {questionData.question?.title}
        </h1>

        <div className="flex gap-6">
          {/* VOTES */}
          <div className="flex flex-col items-center text-gray-600">
            <button
              className={`text-2xl ${
                userVote === 1 ? "text-orange-500" : "hover:text-orange-500"
              }`}
              disabled={voting}
              onClick={() => handleVote("up")}
            >
              ▲
            </button>

            <span className="text-lg font-medium">{voteCount}</span>

            <button
              className={`text-2xl ${
                userVote === -1 ? "text-orange-500" : "hover:text-orange-500"
              }`}
              disabled={voting}
              onClick={() => handleVote("down")}
            >
              ▼
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1">
            <p className="text-gray-800 whitespace-pre-line">
              {questionData.question?.description}
            </p>

            <div className="text-sm text-gray-500 mt-4">
              {timeAgo(questionData.question?.created_at)} by{" "}
              <span className="text-blue-600 cursor-pointer">
                {questionData.question?.users?.username}
              </span>
            </div>
          </div>
        </div>

        <hr className="my-8" />

        {/* ANSWER BOX */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Answer</h2>

          <textarea
            className="w-full min-h-[180px] border rounded-md p-3"
            placeholder="Type your answer here..."
          />

          <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md">
            Post Your Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
