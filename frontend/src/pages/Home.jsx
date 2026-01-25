import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import AllQuestions from "../components/AllQuestions.jsx";
import axios from "axios";
import { supabase } from "../config/supabase.js";
import { useSearchParams } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Home = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10); // default 10
  const [sort, setSort] = useState("newest");
  const [tags, setTags] = useState("");

  const [totalPages, setTotalPages] = useState(0);
  const [currentUserId, setCurrentUserId] = useState(null);

  /* ---------- LOAD AUTH USER ---------- */
  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setCurrentUserId(data?.user?.id ?? null);
    };
    loadUser();
  }, []);

  /* ---------- FETCH QUESTIONS ---------- */
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(`${apiUrl}/questions`, {
          params: { page, limit, sort, tags, search },
        });

        setQuestions(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 0);
      } catch (err) {
        setError("Failed to fetch questions.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [page, limit, sort, tags, search]);

  /* ---------- HANDLERS ---------- */
  const changeSort = (value) => {
    setSort(value);
    setPage(1); // reset page when sort changes
  };

  const changeLimit = (value) => {
    setLimit(value);
    setPage(1); // reset page when page size changes
  };

  return (
    <>
      <Header />

      {/* ---------- HEADER ---------- */}
      <div className="flex justify-between mx-10 px-4 mt-8 items-center">
        <h1 className="text-2xl font-bold">
          {sort === "newest" ? "Newest Questions" : "Oldest Questions"}
        </h1>
        <Link to="/ask-question">
          <button className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Ask Question
          </button>
        </Link>
      </div>

      {/* ---------- SORT TABS ---------- */}
      <div className="flex ml-14 mt-3 items-center gap-1 border border-gray-300 rounded-md w-fit bg-white">
        <button
          onClick={() => changeSort("newest")}
          className={`px-3 py-1.5 text-sm rounded-md ${
            sort === "newest"
              ? "bg-gray-200 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Newest
        </button>

        <button
          onClick={() => changeSort("oldest")}
          className={`px-3 py-1.5 text-sm rounded-md ${
            sort === "oldest"
              ? "bg-gray-200 text-gray-900 font-medium"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Oldest
        </button>
      </div>

      {/* ---------- QUESTIONS ---------- */}
      <AllQuestions questions={questions} currentUserId={currentUserId} />

      {loading && (
        <p className="mt-10 text-center text-gray-500">Loading questions...</p>
      )}

      {error && <p className="mt-10 text-center text-red-500">{error}</p>}

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mx-14 my-10">
          {/* Page Numbers */}
          <div className="flex gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  page === i + 1
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>

          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">per page</span>
            {[10, 30, 50].map((value) => (
              <button
                key={value}
                onClick={() => changeLimit(value)}
                className={`px-3 py-1 border rounded ${
                  limit === value
                    ? "bg-orange-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
