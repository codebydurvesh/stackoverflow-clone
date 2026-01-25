import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase.js";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const Account = () => {
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutHandler = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const loadAccount = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        console.log("No session found, redirecting to home.");
        navigate("/");
        return;
      }

      const res = await axios.get(`${apiUrl}/account/me`, {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      setProfile(res.data);
      setLoading(false);
    };

    loadAccount();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center mt-24 text-gray-500">
          Loading account...
        </div>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header />
        <div className="flex justify-center mt-24 text-red-500">
          Failed to load profile
        </div>
      </>
    );
  }

  return (
    <div>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-6 mt-24">
        {/* PROFILE HEADER */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-md border border-gray-200">
          <img
            src="https://cdn-icons-png.freepik.com/512/9307/9307950.png"
            alt="account"
            className="w-28 h-28 rounded-md object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {profile.username}
            </h1>
            <p className="text-gray-600">{profile.email}</p>

            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <span>
                <strong>{profile?.reputation ?? 0}</strong> reputation
              </span>
              <span>
                <strong>{profile?.questions_count ?? 0}</strong> questions
              </span>
              <span>
                <strong>{profile?.answers_count ?? 0}</strong> answers
              </span>
            </div>
          </div>

          <button
            onClick={logoutHandler}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          >
            Log out
          </button>
        </div>

        {/* ACCOUNT DETAILS */}
        <div className="mt-6 bg-white rounded-md border border-gray-200">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-medium">Account Details</h2>
          </div>

          <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Username</p>
              <p className="text-gray-900">{profile.username}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{profile.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Member Since</p>
              <p className="text-gray-900">
                {new Date(profile.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reputation</p>
              <p className="text-gray-900">{profile.reputation ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
