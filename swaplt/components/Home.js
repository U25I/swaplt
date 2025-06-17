// src/components/Home.js
import React, { useEffect, useState } from 'react';
import './Home.css';

function Home() {
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const guestStatus = localStorage.getItem("isGuest") === "true";
    setIsGuest(guestStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isGuest");
    window.location.href = "/";
  };

  return (
    <div className="home-container">
      <h1>{isGuest ? "Welcome, Guest!" : "Welcome Back!"}</h1>
      <p>
        {isGuest
          ? "You’re browsing as a guest. Sign up or log in for full access!"
          : "Thanks for logging in. Enjoy full access to your account!"}
      </p>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#d9534f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Home;
