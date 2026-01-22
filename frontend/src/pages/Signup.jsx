import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

const Signup = () => {
  return (
    <>
      <Header />

      <div className="flex justify-center items-center h-screen">
        <div className="h-120 w-[25%] border-2 border-gray-200 rounded-md shadow-xl flex flex-col justify-start p-10 gap-3">
          <h1 className="mt-11 text-3xl font-bold mb-5 text-center">
            Create Your Account
          </h1>
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
