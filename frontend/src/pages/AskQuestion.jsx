import React, { useState } from "react";
import Header from "../components/Header";
import { supabase } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [moderationError, setModerationError] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) {
      setError("You must be logged in to ask a question.");
      setLoading(false);
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      await axios.post(
        `${apiUrl}/questions/create`,
        {
          title,
          description,
          tags: tagsArray,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      setLoading(false);
      setTimeout(() => {
        navigate("/");
      }, 100);
    } catch (error) {
      if (error.response?.status === 400) {
        setModerationError(`🚫 ${error.response.data.reason}`);
      } else {
        setModerationError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Page Header */}
        <h1 className="text-2xl font-semibold mb-6">Ask a public question</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-md p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <p className="text-xs text-gray-500 mb-2">
              Be specific and imagine you’re asking a question to another
              person.
            </p>
            <input
              type="text"
              placeholder="e.g. Why does changing the FPS limit affect Graphics2D rendering?"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              What are the details of your problem?
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Introduce the problem and expand on what you’ve put in the title.
            </p>
            <textarea
              placeholder="Include details, code snippets, error messages, etc."
              className="w-full min-h-[220px] border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <p className="text-xs text-gray-500 mb-2">
              Add up to 5 tags separated by commas.
            </p>
            <input
              type="text"
              placeholder="e.g. java, performance, graphics2d"
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Submit */}
          <div>
            <div className="text-red-600 mb-1">{moderationError}</div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Posting..." : "Post your question"}
              </button>

              <button
                type="button"
                className="text-gray-600 border border-gray-300 w-18 rounded-md hover:text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setTags("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;
