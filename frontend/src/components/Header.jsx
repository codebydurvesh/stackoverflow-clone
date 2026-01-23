import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-full h-16 bg-white border-b shadow-sm border-gray-300 sticky top-0 z-50">
      <div className="fixed flex justify-center w-full p-2 gap-5 border-gray-300 border-2 ">
        <Link to="/">
          <img
            className="h-9 hover:cursor-pointer"
            src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.svg"
            alt="stackoverflow logo"
          />
        </Link>
        <a
          href="https://stackoverflow.co/"
          target="_blank"
          className="text-gray-400 text-[15px] hover:bg-gray-200 rounded-md p-3"
        >
          About
        </a>
        <a
          href="https://stackoverflow.co/internal/"
          target="_blank"
          className="text-gray-400 text-[15px] w-23 hover:bg-gray-200 rounded-md p-3"
        >
          For Teams
        </a>

        <input
          type="text"
          placeholder="Search..."
          className="bg-white w-[53%] p-2 rounded-md text-sm border-2 border-gray-300"
        />

        <Link to="/account">
          <img
            src="https://cdn-icons-png.freepik.com/512/9307/9307950.png"
            alt="account icon"
            className="h-11 cursor-pointer hover:bg-gray-200 rounded-full"
          />
        </Link>

        {/* <button className="text-blue-600 w-25 bg-white border-1 p-2 rounded-md hover:bg-gray-200 cursor-pointer">
            Log in
          </button>
          <button className="text-white w-25 bg-blue-600 border-1 p-2 rounded-md hover:bg-blue-700 cursor-pointer">
            Sign up
          </button> */}
      </div>
    </div>
  );
};

export default Header;
