import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaAppleAlt, FaRunning, FaBed, FaExclamationTriangle } from 'react-icons/fa'; // Importing icons

const RecommendationsPage = () => {
  const [recommendations, setRecommendations] = useState({
    dietaryAdvice: [],
    activityGuidelines: [],
    sleepTips: [],
    healthAlerts: [],
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("healthData")) || {
      weightTrends: [],
      sleepPatterns: [],
      insights: [],
      age: null,
      height: null,
      goal: null,
    };

    const mealLog = JSON.parse(localStorage.getItem("mealLog")) || [];
    const healthData = JSON.parse(localStorage.getItem("healthData")) || {};

    const dietaryAdvice = [
      mealLog.length > 0
        ? `Based on your meal log, consider balancing your diet with more fruits and vegetables.`
        : `Start logging your meals to receive personalized dietary advice.`,
      "Drink plenty of water to stay hydrated.",
      healthData.goal === "weight_loss"
        ? "Consider reducing your caloric intake to help achieve your weight loss goal."
        : "Maintain a balanced diet for overall health."
    ];

    const activityGuidelines = [
      "Incorporate at least 30 minutes of moderate exercise daily.",
      "Consider activities like walking, jogging, or yoga based on your fitness level.",
      healthData.age && healthData.age > 40
        ? "Since you're above 40, focus on low-impact exercises to protect your joints."
        : "Feel free to try a variety of activities that suit your preferences."
    ];

    const sleepTips = [
      userData.sleepPatterns.length > 0
        ? `Your average sleep duration is ${(
            userData.sleepPatterns.reduce((acc, item) => acc + item.hours, 0) /
            userData.sleepPatterns.length
          ).toFixed(1)} hours. Aim for 7-8 hours of sleep per night.`
        : "Log your sleep hours regularly to receive tailored tips.",
      "Maintain a consistent bedtime routine to improve sleep quality.",
    ];

    const healthAlerts = [];
    const latestWeight =
      userData.weightTrends.length > 0
        ? userData.weightTrends[userData.weightTrends.length - 1].weight
        : null;

    if (latestWeight && latestWeight > 100) {
      healthAlerts.push("Your weight indicates a potential risk for obesity. Consult a healthcare provider.");
    }

    if (
      userData.sleepPatterns.length > 0 &&
      userData.sleepPatterns.some((item) => item.hours < 5)
    ) {
      healthAlerts.push("You have logged insufficient sleep on several days. Aim for at least 7 hours of sleep.");
    }

    setRecommendations({ dietaryAdvice, activityGuidelines, sleepTips, healthAlerts });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-blue-700 text-white">
      <Header />

      <main className="flex-grow p-6">
        <h2 className="text-4xl font-bold mb-8 text-center">Personalized Recommendations</h2>

        {/* Dietary Advice */}
        <section className="mb-8 bg-white bg-opacity-30 p-8 rounded-lg shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 flex items-center">
            <FaAppleAlt className="mr-4 text-green-400" /> Dietary Advice
          </h3>
          <ul className="list-disc pl-8 space-y-3">
            {recommendations.dietaryAdvice.map((item, index) => (
              <li key={index} className="text-lg hover:text-teal-200 transition-colors">{item}</li>
            ))}
          </ul>
        </section>

        {/* Activity Guidelines */}
        <section className="mb-8 bg-white bg-opacity-30 p-8 rounded-lg shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 flex items-center">
            <FaRunning className="mr-4 text-orange-400" /> Activity Guidelines
          </h3>
          <ul className="list-disc pl-8 space-y-3">
            {recommendations.activityGuidelines.map((item, index) => (
              <li key={index} className="text-lg hover:text-teal-200 transition-colors">{item}</li>
            ))}
          </ul>
        </section>

        {/* Sleep Tips */}
        <section className="mb-8 bg-white bg-opacity-30 p-8 rounded-lg shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 flex items-center">
            <FaBed className="mr-4 text-purple-400" /> Sleep Tips
          </h3>
          <ul className="list-disc pl-8 space-y-3">
            {recommendations.sleepTips.map((item, index) => (
              <li key={index} className="text-lg hover:text-teal-200 transition-colors">{item}</li>
            ))}
          </ul>
        </section>

        {/* Health Alerts */}
        <section className="mb-8 bg-white bg-opacity-30 p-8 rounded-lg shadow-xl">
          <h3 className="text-3xl font-semibold mb-6 flex items-center">
            <FaExclamationTriangle className="mr-4 text-red-400" /> Health Alerts
          </h3>
          {recommendations.healthAlerts.length > 0 ? (
            <ul className="list-disc pl-8 space-y-3">
              {recommendations.healthAlerts.map((item, index) => (
                <li key={index} className="text-lg mb-2 text-red-300">{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xl text-green-300">No health alerts at the moment. Keep up the good work!</p>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RecommendationsPage;
