import React, { useState, useEffect } from "react";
import Header from "../components/Header.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const QuestionDetails = () => {
  const timeAgo = (date) => {
    const seconds = Math.floor((Date.now() - new Date(date)) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    return new Date(date).toLocaleDateString();
  };

  const { id } = useParams();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  // const [votes, setVotes] = useState(0);
  // const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      setLoading(true);
      const res = await axios.get(`${apiUrl}/questions/details/${id}`);
      setQuestionData(res.data);
      setLoading(false);
    };
    fetchQuestionDetails();
  }, [id]);

  console.log(questionData);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!questionData) {
    return <div>Question Not Found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 mt-5">
        {/* Question Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {questionData.question?.title}
        </h1>

        <div className="flex gap-6">
          {/* Vote Section */}
          <div className="flex flex-col items-center text-gray-600">
            <button className="text-2xl hover:text-orange-500">▲</button>

            <span className="text-lg font-medium">
              {questionData?.votes || 0}
            </span>

            <button className="text-2xl hover:text-orange-500">▼</button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {questionData.question?.description}
            </p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-4">
              {questionData?.question?.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Info */}
            <div className="text-sm text-gray-500 mt-4">
              {timeAgo(questionData.question?.created_at)} by{" "}
              <span className="text-blue-600 cursor-pointer">
                {questionData.question?.users?.username}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <hr className="my-8" />

        {/* Answer Section */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Your Answer</h2>

          <textarea
            placeholder="Type your answer here..."
            className="w-full min-h-[180px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
