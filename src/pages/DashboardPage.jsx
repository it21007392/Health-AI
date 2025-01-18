import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth, db } from "../firebase"; // Import Firebase auth and Firestore
import { doc, getDoc } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardPage = () => {
  const [data, setData] = useState({
    weightTrends: [],
    sleepPatterns: [],
    insights: [],
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to track popup visibility
  const navigate = useNavigate();

  // Fetch authenticated user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false); // Stop loading once the user is determined
    });

    return () => unsubscribe();
  }, []);

  // Fetch data from Firestore when user is logged in
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "healthData", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setData(docSnap.data());
          } else {
            console.log("No data found for the user.");
          }
        } catch (error) {
          console.error("Error fetching data from Firebase:", error);
        }
      };

      fetchData();
    } else if (!loading) {
      // If the user is not logged in and loading is complete, navigate to login
      navigate("/login");
    }
  }, [user, navigate, loading]);

  const handleClosePopup = (e) => {
    if (e.target === e.currentTarget) {
      setIsPopupOpen(false); // Close the popup when clicked outside
    }
  };

  const showMostRecentInsight = data.insights[data.insights.length - 1]; // Show the last insight

  if (loading) {
    // Show a loading indicator until we know the user state
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-blue-700 text-white">
      <Header />

      <main className="flex-grow flex flex-col p-6 lg:p-12 gap-8">
        <h2 className="text-3xl font-bold text-center">Dashboard</h2>

        {/* Key Insights Section */}
        <section className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Key Insights
          </h3>

          {/* Display the most recent insight */}
          <div className="overflow-hidden">
            <p className="text-gray-700">
              {showMostRecentInsight || "No insights available yet."}
            </p>
          </div>

          {/* View History Button */}
          <button
            onClick={() => setIsPopupOpen(true)}
            className="mt-4 text-blue-500 hover:text-blue-700"
          >
            View History
          </button>
        </section>

        {/* View History Popup */}
        {isPopupOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" // Added z-index here
            onClick={handleClosePopup}
          >
            <div
              className="bg-white text-gray-800 rounded-lg shadow-lg p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the popup
            >
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                Insight History
              </h3>

              <div
                className="max-h-80 overflow-y-auto"
                style={{ maxHeight: "300px" }} // Added a max-height with scroll
              >
                <ul className="space-y-3">
                  {data.insights.length > 0 ? (
                    data.insights
                      .slice(0) // Ensure we preserve order
                      .reverse() // Reverse to show the latest insights first
                      .map((insight, index) => (
                        <li key={index}>• {insight}</li>
                      ))
                  ) : (
                    <li>No insights available yet.</li>
                  )}
                </ul>
              </div>

              {/* Close button */}
              <button
                onClick={() => setIsPopupOpen(false)}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Visualizations Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Weight Trends */}
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Weight Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.weightTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Patterns */}
          <div className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Sleep Patterns
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.sleepPatterns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="hours"
                  stroke="#82ca9d"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="bg-white text-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-blue-600 mb-4">
            Quick Links
          </h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/data-input"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            >
              Input New Data
            </a>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600">
              View Recommendations
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;
