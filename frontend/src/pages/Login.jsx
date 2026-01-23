import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { supabase } from "../config/supabase.js";

const Login = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Login successful!");
      setTimeout(() => {
        navigate("/");
      }, 500);
    }
  };

  return (
    <>
      <Header />
      <div className="flex justify-center items-center h-[80vh]">
        <div className="h-120 w-[25%] border-2 border-gray-200 rounded-md shadow-xl flex flex-col justify-start p-10 gap-3">
          <h1 className="mt-11 text-3xl font-bold mb-5 text-center">Login</h1>
          <input
            type="text"
            placeholder="Email"
            className="bg-white w-full p-2 rounded-md text-sm border-2 border-gray-300"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white w-full p-2 rounded-md text-sm border-2 border-gray-300"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && (
            <div className="text-green-500 text-center">{success}</div>
          )}
          <button
            className="p-2 bg-blue-500 text-white rounded-md mt-10 hover:bg-blue-600 cursor-pointer"
            disabled={loading}
            onClick={loginHandler}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600">
            Are you an employer?{" "}
            <a
              className="text-blue-500"
              href="https://talent.stackoverflow.com/users/login"
              target="_blank"
            >
              Sign up on Talent
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
