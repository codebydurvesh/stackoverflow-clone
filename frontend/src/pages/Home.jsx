import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import AllQuestions from "../components/AllQuestions.jsx";

const Home = () => {
  return (
    <>
      <Header />
      <div className="flex justify-between mx-10 px-4 mt-8 items-center">
        <h1 className="text-2xl font-bold">Newest Questions</h1>
        <Link to="/ask-question">
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer">
            Ask Questions
          </button>
        </Link>
      </div>
      <AllQuestions />
    </>
  );
};

export default Home;
