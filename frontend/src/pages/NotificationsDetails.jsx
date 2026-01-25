import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase } from "../config/supabase";
import Header from "../components/Header";

const apiUrl = import.meta.env.VITE_API_URL;

const NotificationDetails = () => {
  const { id } = useParams(); // notificationId
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      const { data: session } = await supabase.auth.getSession();

      const res = await axios.get(`${apiUrl}/notifications/details/${id}`, {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      });

      setData(res.data);
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);

    const { data: session } = await supabase.auth.getSession();

    await axios.patch(
      `${apiUrl}/answers/${data.answers.id}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.session.access_token}`,
        },
      },
    );
    alert("Answer accepted successfully.");
    navigate("/notifications");
  };

  const handleReject = async () => {
    if (rejecting) return;
    setRejecting(true);

    const { data: session } = await supabase.auth.getSession();

    await axios.delete(`${apiUrl}/answers/${data.answers.id}/reject`, {
      headers: {
        Authorization: `Bearer ${session.session.access_token}`,
      },
    });
    alert("Answer rejected and deleted.");
    navigate("/notifications");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex justify-center mt-12">Loading...</div>
      </>
    );
  }

  const answer = data.answers;
  const question = data.questions;

  return (
    <>
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* QUESTION */}
        <div className="border-b pb-6 mb-6">
          <h1 className="text-2xl font-semibold mb-3">{question.title}</h1>

          <p className="text-gray-800 whitespace-pre-line">
            {question.description}
          </p>
        </div>

        {/* ANSWER */}
        <div className="border rounded-md p-5 bg-yellow-50 border-yellow-300">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">
              Answer by{" "}
              <span className="font-medium">{answer.users.username}</span>
            </p>

            {!answer.is_accepted && (
              <span className="text-yellow-700 text-sm font-semibold">
                Pending decision
              </span>
            )}
          </div>

          <p className="text-gray-900 whitespace-pre-line">{answer.content}</p>

          {!answer.is_accepted && (
            <div className="flex gap-3 mt-5">
              {/* ACCEPT */}
              <button
                onClick={handleAccept}
                disabled={accepting}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {accepting ? "Accepting..." : "Accept"}
              </button>

              {/* REJECT */}
              <button
                onClick={handleReject}
                disabled={rejecting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                {rejecting ? "Rejecting..." : "Reject"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationDetails;
