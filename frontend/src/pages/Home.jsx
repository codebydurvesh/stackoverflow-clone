import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import AllQuestions from "../components/AllQuestions.jsx";
import axios from "axios";
import { useEffect } from "react";
import { supabase } from "../config/supabase.js";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("newest");
  const [tags, setTags] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("Error fetching user:", error);
        return;
      }
      setCurrentUserId(data?.user?.id ?? null);
    };
    loadUser();
  }, []);

  console.log("Current User ID in Home:", currentUserId);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${apiUrl}/questions`, {
          params: { page, limit, sort, tags },
        });
        setQuestions(res.data.data || []);
      } catch (error) {
        setError("Failed to fetch questions. Please try again.");
        console.log("Fetch Questions Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);
  console.log(questions);
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
      <div className="flex ml-14 mt-2 items-center gap-1 border border-gray-300 rounded-md w-fit bg-white">
        {/* Active tab */}
        <button className="px-3 py-1.5 text-sm font-medium bg-gray-200 text-gray-900 rounded-md">
          Newest
        </button>
        {/* Normal tabs */}
        <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md">
          Oldest
        </button>
      </div>
      <AllQuestions questions={questions} currentUserId={currentUserId} />
      {loading && (
        <p className="flex mt-20 justify-center items-center text-sm text-gray-500">
          Loading questions...
        </p>
      )}
      {error && (
        <p className="flex mt-20 justify-center items-center text-red-500">
          {error}
        </p>
      )}
    </>
  );
};

export default Home;
