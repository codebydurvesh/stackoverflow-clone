import React, { useState } from "react";
import Header from "../components/Header.jsx";

const questionData = {
  id: 1,
  title:
    "Why does changing the FPS limit affect Graphics2D rendering performance?",
  description: `
I'm working with an AWT Canvas with a triple buffered BufferStrategy.
The application runs a loop that renders the screen with a set maximum FPS.
Specifically I'm drawing multiple characters on screen and the performance
changes drastically when FPS is limited.
  `,
  votes: 0,
  tags: ["java", "performance", "graphics2d", "java-2d"],
  author: "Marlo Kuisma",
  time: "asked 6 mins ago",
};

const QuestionDetails = () => {
  const [votes, setVotes] = useState(questionData.votes);
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-6 mt-5">
        {/* Question Title */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          {questionData.title}
        </h1>

        <div className="flex gap-6">
          {/* Vote Section */}
          <div className="flex flex-col items-center text-gray-600">
            <button
              onClick={() => setVotes(votes + 1)}
              className="text-2xl hover:text-orange-500"
            >
              ▲
            </button>

            <span className="text-lg font-medium">{votes}</span>

            <button
              onClick={() => setVotes(votes - 1)}
              className="text-2xl hover:text-orange-500"
            >
              ▼
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <p className="text-gray-800 leading-relaxed whitespace-pre-line">
              {questionData.description}
            </p>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mt-4">
              {questionData.tags.map((tag, index) => (
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
              {questionData.time} by{" "}
              <span className="text-blue-600 cursor-pointer">
                {questionData.author}
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
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here..."
            className="w-full min-h-[180px] border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
            onClick={() => {
              console.log("Answer submitted:", answer);
              setAnswer("");
            }}
          >
            Post Your Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;
