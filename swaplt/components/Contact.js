import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io'; // Back arrow icon

import './Contact.css'; // Assuming you have a CSS file for styling

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        // Removed 'subject' field from state as it's not in the contacts table schema for contact.php
        message: ''
    });

    const [responseMessage, setResponseMessage] = useState(''); // State for backend response message (e.g., success)
    const [error, setError] = useState(null); // State for handling errors

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);

        setResponseMessage(''); // Clear previous response messages
        setError(null);       // Clear previous errors

        // Basic frontend validation
        if (!formData.name || !formData.email || !formData.message) {
            setError('Please fill in all required fields (Name, Email, Message).');
            return;
        }

        try {
            const phpApiUrl = 'http://localhost:8080/backend/api/contact.php'; // Your PHP backend endpoint for contact

            const response = await fetch(phpApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Tell the server we are sending JSON
                },
                body: JSON.stringify(formData), // Send form data as JSON
            });

            // PHP backend will return a JSON response with 'status' and 'message'
            const data = await response.json(); 
            console.log('Backend response:', data);

            if (response.ok && data.status === 'success') { // Check both HTTP status and PHP's internal status
                setResponseMessage(data.message || 'Thank you for your message! We will get back to you soon.');
                setFormData({ // Clear the form on successful submission
                    name: '',
                    email: '',
                    message: ''
                });
            } else {
                // Handle cases where HTTP status is not OK (e.g., 400, 500) or PHP returned an 'error' status
                const errorMessage = data.message || `Failed to send message. Server responded with status ${response.status}.`;
                throw new Error(errorMessage);
            }

        } catch (err) {
            console.error('Error sending contact form to backend:', err);
            // Display a user-friendly error message
            setError(err.message || 'Failed to send message. Please check your internet connection or try again later.');
            setResponseMessage(''); // Ensure success message is cleared on error
        }
    };

    return (
        <div className="contact-container">
            <header className="contact-header">
                <button onClick={handleBackClick} className="back-button">
                    <IoIosArrowBack /> {/* Back arrow icon */}
                </button>
                <h2>Contact Us</h2>
            </header>

            <main className="contact-main-content">
                <p className="contact-intro">
                    Have a question, feedback, or need support? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Your Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your Name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Your Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Your Email"
                            required
                        />
                    </div>

                    {/* Removed the subject input field as it's not in the backend/database schema */}
                    {/*
                    <div className="form-group">
                        <label htmlFor="subject">Subject:</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            required
                        />
                    </div>
                    */}

                    <div className="form-group">
                        <label htmlFor="message">Your Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message here..."
                            required
                        ></textarea>
                    </div>

                    {/* --- Display Response/Error Messages Here --- */}
                    {responseMessage && <p className="submission-message success-message">{responseMessage}</p>}
                    {error && <p className="submission-message error-message">{error}</p>}
                    {/* --- End Display --- */}

                    <button type="submit" className="send-message-button">
                        Send Message
                    </button>
                </form>
            </main>

            <section className="contact-info-section">
                <h2>Other Ways to Reach Us</h2>
                <div className="contact-info-grid">
                    <div className="info-item">
                        <h3>Email</h3>
                        <p>support@barter.com</p>
                    </div>
                    <div className="info-item">
                        <h3>Phone</h3>
                        <p>+91 123 456 7890</p>
                    </div>
                    <div className="info-item">
                        <h3>Address</h3>
                        <p>123 Barter Lane, Swap City, India</p>
                    </div>
                </div>
            </section>

            <section className="contact-map-section">
                <h2>Find Us on the Map</h2>
                <div className="map-placeholder">
                    {/* Google Maps iframe embedded here */}
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.25056778408!2d144.963138815317!3d-37.81362797975149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577491d9c49d2b!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1678229867990!5m2!1sen!2sau"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Our Location"
                    ></iframe>
                </div>
            </section>
        </div>
    );
}

export default Contact;
