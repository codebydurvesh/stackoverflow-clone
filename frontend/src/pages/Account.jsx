import React from "react";
import Header from "../components/Header";

const user = {
  username: "Durvesh",
  email: "durvesh@example.com",
  reputation: 121,
  questions: 5,
  answers: 12,
  joined: "Jan 2026",
  avatar:
    "https://ui-avatars.com/api/?name=Durvesh&background=0D8ABC&color=fff",
};

const Account = () => {
  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6 mt-24">
        {/* Header */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-md border border-gray-200">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="w-28 h-28 rounded-md object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {user.username}
            </h1>
            <p className="text-gray-600">{user.email}</p>

            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <span>
                <strong>{user.reputation}</strong> reputation
              </span>
              <span>
                <strong>{user.questions}</strong> questions
              </span>
              <span>
                <strong>{user.answers}</strong> answers
              </span>
            </div>
          </div>

          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
            Log out
          </button>
        </div>

        {/* Account Details */}
        <div className="mt-6 bg-white rounded-md border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Account Details</h2>
          </div>

          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-gray-900">{user.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-gray-900">{user.joined}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reputation</p>
              <p className="text-gray-900">{user.reputation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
