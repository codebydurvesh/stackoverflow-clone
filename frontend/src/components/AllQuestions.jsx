import React from "react";
import { Link } from "react-router-dom";

const AllQuestions = ({ questions }) => {
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

  return (
    <div className="w-full bg-white rounded-md border border-gray-200 mt-8">
      {questions.map((q) => (
        <div
          key={q.id}
          className="flex gap-6 px-6 py-4 border-b last:border-b-0"
        >
          {/* Left Stats */}
          <div className="flex flex-col items-center text-sm text-gray-600 min-w-[90px]">
            <span className="font-medium">{q.votes || 0} votes</span>
            <span className="font-medium">{q.answers || 0} answers</span>
            <span>{q.views || 0} views</span>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <h2 className="text-blue-600 hover:text-blue-800 font-medium text-lg cursor-pointer">
              <Link to={`/question/${q.id}`}>{q.title}</Link>
            </h2>
            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {q.description}
            </p>

            {/* Tags + Author */}
            <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {q.tags?.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {tag || "none"}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                asked by{" "}
                <span className="text-blue-600 cursor-pointer">
                  {q.user?.username}
                </span>{" "}
                {timeAgo(q.created_at)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllQuestions;
