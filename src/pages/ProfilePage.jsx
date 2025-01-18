import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { auth } from "../firebase";
import { db } from "../firebase"; // Import Firestore instance
import { doc, getDoc, setDoc,  } from "firebase/firestore";
import { updateProfile } from "firebase/auth";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    photoURL: "",
    age: "",
    birthday: "",
  });

  // Fetch user data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        setProfileData((prev) => ({
          ...prev,
          displayName: currentUser.displayName || "",
          email: currentUser.email || "",
          photoURL: currentUser.photoURL || "",
        }));

        // Fetch additional fields from Firestore
        const userDoc = doc(db, "users", currentUser.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setProfileData((prev) => ({
            ...prev,
            age: data.age || "",
            birthday: data.birthday || "",
            displayName: data.displayName || prev.displayName,
            email: data.email || prev.email,
          }));
        }
      }
    };

    fetchData();
  }, []);

  // Handle input changes during edit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Save updated profile data
  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        // Update displayName and photoURL in Firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
        });

        // Save all data to Firestore
        const userDoc = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDoc, {
          displayName: profileData.displayName,
          email: profileData.email,
          photoURL: profileData.photoURL,
          age: profileData.age,
          birthday: profileData.birthday,
        }, { merge: true });

        setUser({ ...auth.currentUser }); // Update local user state
        setIsEditing(false); // Exit edit mode
        alert("Profile updated successfully.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-500 to-blue-700 text-white">
      <Header />

      {/* Main Content */}
      <main className="flex-grow p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Profile Page</h2>

        <div className="max-w-3xl mx-auto bg-white text-gray-800 rounded-lg shadow-lg p-6">
          {/* Profile Picture */}
          <div className="flex items-center justify-center mb-6">
            <img
              src={
                profileData.photoURL ||
                "https://via.placeholder.com/150" // Placeholder if no profile picture
              }
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-indigo-500 object-cover"
            />
          </div>

          {/* Profile Details */}
          <div>
            <div className="mb-4">
              <label className="font-semibold">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-lg">{profileData.displayName || "N/A"}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-semibold">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-lg">{profileData.email || "N/A"}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-semibold">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={profileData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-lg">{profileData.age || "N/A"}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="font-semibold">Birthday</label>
              {isEditing ? (
                <input
                  type="date"
                  name="birthday"
                  value={profileData.birthday}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              ) : (
                <p className="text-lg">{profileData.birthday || "N/A"}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
