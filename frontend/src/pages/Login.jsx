import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

const Login = () => {
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
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white w-full p-2 rounded-md text-sm border-2 border-gray-300"
          />
          <button className="p-2 bg-blue-500 text-white rounded-md mt-10 hover:bg-blue-600 cursor-pointer">
            Log in
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
