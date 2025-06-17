import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for the Contact Us button
import './AboutUs.css'; // We'll create this CSS file next

function AboutUs() {
  return (
    <div className="about-us-container">
      <header className="about-us-header">
        <h1>About Us</h1>
        <p>Our Mission, Vision, and Values</p>
      </header>

      <section className="about-us-mission">
        <h2>Our Mission</h2>
        <p>At Barter, our mission is to empower communities to embrace sustainable living by facilitating seamless and trustworthy exchanges of goods. We aim to reduce waste, foster resourcefulness, and build stronger local connections through the act of swapping.</p>
      </section>

      <section className="about-us-values">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>Sustainability</h3>
            <p>Promoting reuse and reducing environmental impact by extending the life cycle of items.</p>
          </div>
          <div className="value-item">
            <h3>Community</h3>
            <p>Building connections and fostering a sense of belonging among local residents through shared resources.</p>
          </div>
          <div className="value-item">
            <h3>Accessibility</h3>
            <p>Making swapping easy and accessible for everyone, regardless of their background or technical skill.</p>
          </div>
          <div className="value-item">
            <h3>Trust & Transparency</h3>
            <p>Ensuring a secure and transparent platform where users can engage in exchanges with confidence.</p>
          </div>
        </div>
      </section>

      <section className="about-us-team">
        <h2>Meet the Team</h2>
        <div className="team-members">
          {/* Placeholder for team member cards */}
          <div className="team-member-card">
            <img src="/images/img1.jpg" alt="Team Member 1" /> {/* Replace with actual image paths */}
            <h3>Jane Doe</h3>
            <p>Co-founder & CEO</p>
            <p>Passionate about circular economy and community building.</p>
          </div>
          <div className="team-member-card">
            <img src="/images/img2.jpg" alt="Team Member 2" /> {/* Replace with actual image paths */}
            <h3>John Smith</h3>
            <p>Co-founder & CTO</p>
            <p>Bringing innovative tech solutions to sustainable practices.</p>
          </div>
        </div>
      </section>

      <section className="about-us-contact">
        <h2>Get in Touch</h2>
        <p>Have questions or want to collaborate? Contact us!</p>
        <Link to="/contact" className="contact-btn">Contact Us</Link>
      </section>
    </div>
  );
}

export default AboutUs;