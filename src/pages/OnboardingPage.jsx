import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Character3D from "../components/Character3D";
import { auth, db } from "../firebase"; // Import Firebase auth and Firestore
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions

const OnboardingPage = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    waist: "",
    dietaryHabits: "",
    sleepPatterns: "",
    healthGoals: "",
  });

  const [user, setUser] = useState(null); // For tracking authenticated user
  const [loading, setLoading] = useState(true); // For tracking loading state

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Load saved data from Firebase on component mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch the user's data from Firestore
        const docRef = doc(db, "onboardingData", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data()); // Set the data from Firestore
        } else {
          // If data does not exist in Firestore, keep the state empty to allow user to input new data
          setFormData({
            gender: "",
            age: "",
            weight: "",
            height: "",
            waist: "",
            dietaryHabits: "",
            sleepPatterns: "",
            healthGoals: "",
          });
        }
      }

      setLoading(false); // Once data is fetched, set loading to false
    });

    return () => unsubscribe();
  }, []);

  // Update window width on resize to handle responsiveness
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (user) {
      try {
        const docRef = doc(db, "onboardingData", user.uid);
        await setDoc(docRef, formData); // Save the form data to Firestore
        alert("Onboarding data saved successfully!");
      } catch (error) {
        console.error("Error saving data to Firebase:", error);
        alert("Failed to save onboarding data.");
      }
    } else {
      alert("You must be logged in to save your data.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Onboarding Data:", formData);
    handleSave(); // Save data on form submission
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-teal-500 to-blue-700 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-blue-700 text-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center relative p-6">
        {/* Enlarged Spinning Character */}
        <div className="w-full lg:w-1/3 h-[500px] lg:h-[800px] flex items-center justify-center mb-6 lg:mb-0">
          <Character3D
            gender={formData.gender || "male"} // Use formData gender or default to male
            weight={formData.weight || 60} // Use formData weight or default to 60
            height={formData.height || 170} // Use formData height or default to 170
            waist={formData.waist || 80} // Use formData waist or default to 80
          />
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-gray-800 rounded-lg shadow-lg p-8 max-w-2xl w-full z-20 lg:ml-auto lg:mr-20"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
            Personalize Your Experience
          </h2>

          {/* Gender */}
          <div className="mb-4 flex justify-between items-center">
            <label className="font-semibold">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Age */}
          <div className="mb-4 flex justify-between items-center">
            <label className="font-semibold">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="w-20 px-4 py-2 border rounded-lg"
              min="10"
              max="100"
            />
          </div>

          {/* Weight */}
          <div className="mb-4">
            <label className="font-semibold">Weight (kg)</label>
            <input
              type="range"
              name="weight"
              min="40"
              max="150"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-center mt-2">{formData.weight} kg</p>
          </div>

          {/* Height */}
          <div className="mb-4">
            <label className="font-semibold">Height (cm)</label>
            <input
              type="range"
              name="height"
              min="120"
              max="220"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-center mt-2">{formData.height} cm</p>
          </div>

          {/* Waist */}
          <div className="mb-4">
            <label className="font-semibold">Waist Circumference (cm)</label>
            <input
              type="number"
              name="waist"
              value={formData.waist}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter waist size"
            />
          </div>

          {/* Dietary Habits */}
          <div className="mb-4">
            <label className="font-semibold">Dietary Habits</label>
            <select
              name="dietaryHabits"
              value={formData.dietaryHabits}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select an option</option>
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
              <option value="vegan">Vegan</option>
              <option value="keto">Keto</option>
            </select>
          </div>

          {/* Sleep Patterns */}
          <div className="mb-4">
            <label className="font-semibold">Sleep Hours</label>
            <input
              type="range"
              name="sleepPatterns"
              min="4"
              max="12"
              value={formData.sleepPatterns}
              onChange={handleInputChange}
              className="w-full"
            />
            <p className="text-center mt-2">{formData.sleepPatterns} hours</p>
          </div>

          {/* Health Goals */}
          <div className="mb-4">
            <label className="font-semibold">Health Goals</label>
            <textarea
              name="healthGoals"
              value={formData.healthGoals}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="E.g., Weight loss, better sleep, etc."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition mb-4"
          >
            Complete Setup
          </button>
        </form>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default OnboardingPage;
