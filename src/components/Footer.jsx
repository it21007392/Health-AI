import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">© {new Date().getFullYear()} Health AI. All rights reserved.</p>
        <div className="mt-1">
          <a href="#" className="text-blue-400 hover:underline">
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-400 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
