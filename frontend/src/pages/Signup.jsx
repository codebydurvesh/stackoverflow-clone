import { useState } from "react";
import { Link, redirect } from "react-router-dom";
import Header from "../components/Header.jsx";
import { supabase } from "../config/supabase.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess(
        "Signup successful! Please check your email to confirm your account.",
      );
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  return (
    <>
      <Header />

      <div className="flex justify-center items-center h-[80vh]">
        <div className="h-120 w-[25%] border-2 border-gray-200 rounded-md shadow-xl flex flex-col justify-start p-10 gap-3">
          <h1 className="mt-11 text-3xl font-bold mb-5 text-center">
            Create Your Account
          </h1>
          <input
            type="text"
            placeholder="Email"
            className="bg-white w-full p-2 rounded-md text-sm border-2 border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white w-full p-2 rounded-md text-sm border-2 border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-center">{error}</div>}
          {success && (
            <div className="text-green-500 text-center">{success}</div>
          )}
          <button
            onClick={handleSignup}
            className="p-2 bg-blue-500 text-white rounded-md mt-10 hover:bg-blue-600 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Log in
            </Link>
          </p>
          <p className="text-center text-sm text-gray-600 mt-5">
            By clicking “Sign up”, you agree to our{" "}
            <a
              className="text-blue-500"
              href="https://stackoverflow.com/legal/terms-of-service/public"
              target="_blank"
            >
              terms of service
            </a>{" "}
            and acknowledge you have read our{" "}
            <a
              className="text-blue-500"
              href="https://stackoverflow.com/legal/privacy-policy"
              target="_blank"
            >
              privacy policy.
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
