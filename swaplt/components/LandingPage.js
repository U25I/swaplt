import React from 'react';
import { Link } from 'react-router-dom'; // Reverted: Removed useNavigate
import './LandingPage.css';


// Reverted: No setLoggedInUser or loggedInUser props
function LandingPage() {
    return (
        <div className="landing-page-container">
            {/* Top Navigation */}
            <header className="top-nav">
                <div className="logo">
                     {/* Replace with your logo path */}
                    <span>SwapIt</span>
                </div>
                <nav className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                </nav>
                <div className="auth-buttons">
                    {/* Reverted: Only Login and Sign Up links */}
                    <Link to="/login" className="btn-login">Login</Link>
                    <Link to="/signup" className="btn-signup">Sign Up</Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="hero-landing-section">
                <h1>Exchange. Empower. <span className="highlight-green">Evolve.</span></h1>
                <p className="hero-description">
                    Join your local community in building a sustainable future through item swapping.
                    Turn what you don't need into something you love, while reducing waste and building connections.
                </p>
                <div className="hero-buttons">
                    <Link to="/dashboard" className="hero-browse-btn">
                        <span className="icon">🔍</span> Browse Items
                    </Link>
                    <Link to="/myitems" className="hero-list-btn">
                        <span className="icon">📦</span> List Your Item
                    </Link>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section">
                <h2>How It Works</h2>
                <div className="steps-container">
                    <div className="step-card">
                        <span className="step-icon">📸</span>
                        <h3>List Your Item</h3>
                        <p>Easily upload details and photos of what you're offering.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-icon">🔎</span>
                        <h3>Browse & Discover</h3>
                        <p>Explore a wide variety of items listed by your community.</p>
                    </div>
                    <div className="step-card">
                        <span className="step-icon">🤝</span>
                        <h3>Connect & Swap</h3>
                        <p>Message users, agree on terms, and make your exchange.</p>
                    </div>
                </div>
            </section>

            {/* Community Impact Section */}
            <section className="community-impact-section">
                <h2>Make a Positive Impact</h2>
                <div className="impact-points">
                    <div className="impact-item">
                        <span className="impact-icon">♻️</span>
                        <p>Reduce Waste & Promote Reuse</p>
                    </div>
                    <div className="impact-item">
                        <span className="impact-icon">💰</span>
                        <p>Save Money & Gain Value</p>
                    </div>
                    <div className="impact-item">
                        <span className="impact-icon">🏘️</span>
                        <p>Strengthen Local Communities</p>
                    </div>
                </div>
                <Link to="/signup" className="cta-button">Join the SwapIt Community Today!</Link>
            </section>

            {/* Footer */}
            <footer className="footer-landing-page">
                <p>&copy; 2025 SwapIt. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/privacy">Privacy Policy</Link>
                    <Link to="/terms">Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;