// src/components/Login.js
import React, { useState } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom'; // Ensure Link is imported for the "Sign up" link

function Login() {
  const navigate = useNavigate();

  // Using a single formData state for consistency, similar to Signup.js
  const [formData, setFormData] = useState({
    emailOrUsername: '', // To match the PHP backend's expected key
    password: ''
  });
  const [message, setMessage] = useState(''); // Combined message for success/error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleLogin = async (e) => { // Make the function async
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!formData.emailOrUsername || !formData.password) {
      setMessage("Please enter both email/username and password.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/backend/api/users.php', { // <-- API CALL HERE
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'login', // This 'type' field tells users.php to handle a login request
          email_or_username: formData.emailOrUsername,
          password: formData.password
        }),
      });

      const data = await response.json(); // Parse the JSON response from PHP

      if (response.ok && data.status === 'success') {
        setMessage(data.message); // Display success message from PHP: "Login successful!"
        
        // IMPORTANT FIX: Store the user ID in localStorage after successful login
        if (data.user && data.user.id) { // Ensure user data and ID exist
            localStorage.setItem('userId', data.user.id); 
            console.log('User ID stored in localStorage:', data.user.id);
        } else {
            console.warn('Login successful but no user ID received from backend.');
            // Handle this case, e.g., by showing a warning or redirecting anyway
        }

        console.log('Login successful, user data:', data.user); // Log the user data
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to dashboard on successful login
        }, 1500); // Redirect after 1.5 seconds
      } else {
        // Handle cases where HTTP status is not OK, or PHP returned an 'error' status
        setMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Network error or server unavailable. Please try again.'); // Catch network issues
    }
  };

  return (
    <div className="login-container">
      <h2>Login to Your Account</h2>

      <form onSubmit={handleLogin}>
        <input
          type="text" // Changed to text to accommodate both email and username
          placeholder="Email or Username"
          name="emailOrUsername" // Added name attribute
          value={formData.emailOrUsername} // Bind to formData state
          onChange={handleChange} // Use common handleChange
          required
        />

        <input
          type="password"
          placeholder="Password"
          name="password" // Added name attribute
          value={formData.password} // Bind to formData state
          onChange={handleChange} // Use common handleChange
          required
        />

        {message && <p className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`}>{message}</p>} {/* Use 'message' state */}

        <button type="submit">Log In</button>
      </form>

      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up</Link> {/* Changed span onClick to Link */}
      </p>
    </div>
  );
}

export default Login;
