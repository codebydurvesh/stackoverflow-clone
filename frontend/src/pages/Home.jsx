import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import AllQuestions from "../components/AllQuestions.jsx";

const Home = () => {
  return (
    <>
      <Header />
      <AllQuestions />
    </>
  );
};

export default Home;
