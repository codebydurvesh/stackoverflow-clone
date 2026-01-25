import { useEffect, useState } from "react";
import axios from "axios";
import { supabase } from "../config/supabase";
import Header from "../components/Header";
import { Link } from "react-router-dom";

const apiUrl = import.meta.env.VITE_API_URL;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data: session } = await supabase.auth.getSession();

      const res = await axios.get(`${apiUrl}/notifications`, {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      setNotifications(res.data);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Notifications</h1>

        {loading ? (
          <p>Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500">No pending notifications.</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <Link
                key={n.id}
                to={`/notifications/${n.id}`}
                className={`block border rounded-md p-4 hover:bg-gray-50 transition ${
                  !n.is_read ? "bg-blue-50 border-blue-300" : ""
                }`}
              >
                {/* Meta text */}
                <p className="text-sm text-gray-500">
                  New answer from{" "}
                  <span className="font-medium text-gray-700">
                    {n.answers?.users?.username}
                  </span>
                </p>

                {/* Question title */}
                <p className="font-medium text-gray-900 mt-1">
                  {n.questions?.title}
                </p>

                {/* Answer preview */}
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {n.answers?.content}
                </p>

                {/* Timestamp */}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(n.created_at).toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
