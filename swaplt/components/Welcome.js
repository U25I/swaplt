import React from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      {/* Updated image path */}
      <img
        src="/images/8.jpg"
        alt="Barter Illustration"
        className="welcome-image"
      />

      <h2>🌟 Show Off What You’ve Got! 🌟</h2>
      <p>
        Upload a clear photo, give your item a catchy title, and add details
        that make it stand out.
        <br />
        The better the info, the faster the exchange!
      </p>

      <button onClick={() => navigate("/signup")} className="primary-btn">
        Create a free account
      </button>

      <div className="btn-row">
        <button onClick={() => navigate("/login")}>Log in</button>
        <button onClick={() => navigate("/home")}>Use as guest</button>
      </div>
    </div>
  );
}

export default Welcome;
