import React from "react";

const questions = [
  {
    id: 1,
    votes: 0,
    answers: 0,
    views: 5,
    title:
      "Why does changing the FPS limit affect Graphics2D rendering performance?",
    description:
      "I'm working with an AWT Canvas with a triple buffered BufferStrategy...",
    tags: ["java", "performance", "graphics2d", "java-2d"],
    author: "Marlo Kuisma",
    time: "6 mins ago",
  },
  {
    id: 2,
    votes: 0,
    answers: 0,
    views: 12,
    title:
      "16-way radix sort without threadgroup/warp shared memory prefixsums",
    description:
      "I've been implementing radix sort for SPH simulation use for some time now...",
    tags: ["sorting", "cuda", "simd", "metal"],
    author: "harism",
    time: "13 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
  {
    id: 3,
    votes: -1,
    answers: 0,
    views: 17,
    title: "Powershell 7 SSH Custom Script Best Practices?",
    description:
      "I am writing a powershell 7 script to ssh into multiple Linux machines...",
    tags: ["powershell", "ssh", "powershell-7.0"],
    author: "Evan",
    time: "20 mins ago",
  },
];

const AllQuestions = () => {
  return (
    <div className="w-full bg-white rounded-md border border-gray-200 mt-8">
      {questions.map((q) => (
        <div
          key={q.id}
          className="flex gap-6 px-6 py-4 border-b last:border-b-0"
        >
          {/* Left Stats */}
          <div className="flex flex-col items-center text-sm text-gray-600 min-w-[90px]">
            <span className="font-medium">{q.votes} votes</span>
            <span className="font-medium">{q.answers} answers</span>
            <span>{q.views} views</span>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <h2 className="text-blue-600 hover:text-blue-800 font-medium text-lg cursor-pointer">
              {q.title}
            </h2>

            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
              {q.description}
            </p>

            {/* Tags + Author */}
            <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
              <div className="flex flex-wrap gap-2">
                {q.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs text-gray-500">
                asked by{" "}
                <span className="text-blue-600 cursor-pointer">{q.author}</span>{" "}
                {q.time}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllQuestions;
