import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { auth } from "./firebase"; // Import Firebase auth
import HomePage from "./pages/HomePage";
import LoginSignupPage from "./pages/LoginSignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import DataInputPage from "./pages/DataInputPage";
import FoodLoggingPage from "./pages/FoodLoggingPage";
import ProfilePage from "./pages/ProfilePage";
import RecommendationsPage from "./pages/RecommendationsPage";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  return (
    <Router basename="/Health-AI">
      <Routes>
        <Route path="/" element={user ? <HomePage /> : <LoginSignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/data-input" element={<DataInputPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/food" element={<FoodLoggingPage />} />
        <Route path="/profile-setup" element={<OnboardingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/recommendations" element={<RecommendationsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
