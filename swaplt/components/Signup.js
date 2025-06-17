// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import './Signup.css'; // Make sure you have this CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState(''); // Changed 'error' to 'message' for combined feedback
  const navigate = useNavigate(); // Hook for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => { // IMPORTANT: Made handleSubmit async
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/backend/api/users.php', { // <-- API CALL HERE
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the type as 'signup' and relevant data
        body: JSON.stringify({
          type: 'signup', // This 'type' field tells users.php to handle a signup request
          username: formData.username,
          email: formData.email,
          password: formData.password // Plain password, PHP will hash it for security
        }),
      });

      const data = await response.json(); // Parse the JSON response from PHP

      // Check if the HTTP response was successful AND PHP's internal status is 'success'
      if (response.ok && data.status === 'success') {
        setMessage(data.message); // Display success message from PHP: "User registered successfully!"
        // Optional: Redirect to login page after successful signup
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect after 2 seconds
      } else {
        // Handle cases where HTTP status is not OK, or PHP returned an 'error' status
        setMessage(data.message || 'Signup failed. Please try again.'); // Display PHP's error message or a generic one
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setMessage('Network error or server unavailable. Please try again.'); // Catch network issues
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-card">
        <h2>Create Your Barter Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>} {/* Display messages */}

          <div className="form-group">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p className="login-prompt">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;