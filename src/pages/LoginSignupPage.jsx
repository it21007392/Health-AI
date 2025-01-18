import React, { useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  OAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const LoginSignupPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Google Login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Facebook Login
  const handleFacebookLogin = async () => {
    const provider = new FacebookAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Apple Login (Using OAuthProvider)
  const handleAppleLogin = async () => {
    const provider = new OAuthProvider("apple.com");
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/home");
    } catch (error) {
      console.error(error.message);
    }
  };

  // Track Auth State
  onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      setUser(currentUser);
    }
  });

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main Container */}
      <div className="flex flex-grow items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 sm:p-8">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Login or Sign Up
          </h2>
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center w-full py-3 mb-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition ease-in-out duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2d/Logo_Google_blanco.png"
              alt="Google"
              className="w-6 h-6 mr-3"
            />
            Continue with Google
          </button>
          {/* Facebook Login */}
          <button
            onClick={handleFacebookLogin}
            className="flex items-center justify-center w-full py-3 mb-4 bg-blue-700 text-white rounded-full hover:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-400 transition ease-in-out duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1024px-Facebook_f_logo_%282019%29.svg.png"
              alt="Facebook"
              className="w-6 h-6 mr-3"
            />
            Continue with Facebook
          </button>
          {/* Apple Login */}
          <button
            onClick={handleAppleLogin}
            className="flex items-center justify-center w-full py-3 mb-4 bg-black text-white rounded-full hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-400 transition ease-in-out duration-200"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/46/Apple_Store_logo.svg"
              alt="Apple"
              className="w-6 h-6 mr-3"
            />
            Continue with Apple
          </button>
          <p className="text-sm text-center text-gray-600 mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginSignupPage;
