import React from "react";
import { auth } from "../firebase";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const userName = auth.currentUser ? auth.currentUser.displayName : "Guest";
  const navigate = useNavigate();

  const handleProfileSetup = () => {
    navigate("/profile-setup"); // Replace with the actual route for the onboarding page
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        {/* Banner Section */}
        <section className="bg-gradient-to-r from-blue-500 to-green-500 text-white text-center py-20 transition-all duration-500">
          <h1 className="text-4xl font-bold mb-4 animate-fadeIn">
            Welcome to Health AI, {userName}!
          </h1>
          <p className="text-lg mb-6">
            Your one-stop platform for personalized health insights and services.
          </p>
          <button
            onClick={handleProfileSetup}
            className="bg-white text-blue-500 font-semibold py-2 px-6 rounded-full hover:bg-gray-100 hover:scale-105 transition-transform duration-300"
          >
            Set Up Your Health Profile
          </button>
        </section>

        {/* Features Section */}
        <section className="py-28 bg-gray-100">
          <h2 className="text-center text-3xl font-bold mb-8 transition-opacity duration-700 opacity-100">
            Why Choose Us?
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3448/3448614.png"
                alt="Health Monitoring"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="font-semibold text-lg">Health Monitoring</h3>
              <p className="text-gray-600 mt-2">
                Track your vital stats in real-time and stay informed.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3062/3062634.png"
                alt="Personalized Insights"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="font-semibold text-lg">Personalized Insights</h3>
              <p className="text-gray-600 mt-2">
                Receive tailored recommendations for a healthier lifestyle.
              </p>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1544/1544493.png"
                alt="Expert Support"
                className="mx-auto mb-4 w-16 h-16"
              />
              <h3 className="font-semibold text-lg">Expert Support</h3>
              <p className="text-gray-600 mt-2">
                Consult with health experts anytime, anywhere.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer className="mt-0" />
    </div>
  );
};

export default HomePage;
