import { useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase.js";
import { useEffect } from "react";

const Account = () => {
  const navigate = useNavigate();
  const logoutHandler = () => {
    const { error } = supabase.auth.signOut();
    if (error) {
      console.log("Error logging out:", error.message);
    } else {
      navigate("/");
    }
  };

  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (!user || userError) {
        console.log("No user found");
        return;
      }
      console.log("Auth user id:", user.id);
      setAuthUser(user);
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();
      setProfile(profile);
    };
    if (profileError) {
      console.log("Error fetching profile:", profileError.message);
    }
    fetchUserDetails();
  }, []);
  console.log(profile);
  console.log(authUser);

  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-6 mt-24">
        {/* Header */}
        <div className="flex items-center gap-6 bg-white p-6 rounded-md border border-gray-200">
          <img
            src="https://cdn-icons-png.freepik.com/512/9307/9307950.png"
            alt="account icon"
            className="w-28 h-28 rounded-md object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {profile ? profile.username : "Loading..."}
            </h1>
            <p className="text-gray-600">
              {profile ? profile.email : "Loading..."}
            </p>

            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <span>
                <strong>{profile ? profile.reputation : "Loading..."}</strong>{" "}
                reputation
              </span>
              <span>
                <strong>{profile ? profile.questions : "Loading..."}</strong>{" "}
                questions
              </span>
              <span>
                <strong>{profile ? profile.answers : "Loading..."}</strong>{" "}
                answers
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

        {/* Account Details */}
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
              <p className="text-gray-900">{profile.joined}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Reputation</p>
              <p className="text-gray-900">{profile.reputation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
