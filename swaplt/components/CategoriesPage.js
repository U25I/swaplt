import React from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaTshirt, FaLaptop, FaHome, FaBook, FaCar,  FaSeedling, FaThLarge } from "react-icons/fa";

import "./CategoriesPage.css";

function CategoriesPage() {
  // Hardcoded list of categories for testing frontend display
  // This list includes a wide range of common categories.
  const categories = [
    { name: "Clothes", icon: <FaTshirt /> },
    { name: "Electronics", icon: <FaLaptop /> },
    { name: "Home Needs", icon: <FaHome /> },
    { name: "Scholar Books", icon: <FaBook /> },
    { name: "Vehicles", icon: <FaCar /> },
    
    { name: "Agriculture & Farming", icon: <FaSeedling /> },
    { name: "Others", icon: <FaThLarge /> },
    // You can add more specific categories here if you had them in mind
    // For example:
    // { name: "Sports Equipment", icon: <FaDumbbell /> }, // Requires FaDumbbell import
    // { name: "Art & Collectibles", icon: <FaPaintBrush /> }, // Requires FaPaintBrush import
  ];

  return (
    <div className="categories-page-container">
      <header className="categories-page-header">
        {/* Assumes /dashboard is where you want to go back to. Adjust if needed. */}
        <Link to="/dashboard" className="back-button">
          <IoIosArrowBack /> Back
        </Link>
        <h2>Categories</h2>
      </header>

      <div className="categories-list">
        {categories.length > 0 ? ( // Check if there are categories to display
          categories.map((category, index) => (
            // Ensure the Link path matches your App.js route for CategoryItemsPage
            // It should be `/categories/:categoryName` or `/category/:categoryName`
            // Based on your App.js, it's `/category/:categoryName`
            <Link to={`/category/${encodeURIComponent(category.name)}`} className="category-item-link" key={index}>
              <div className="category-item">
                <div className="category-icon">{category.icon}</div>
                <span className="category-name">{category.name}</span>
                <IoIosArrowForward className="arrow-icon" />
              </div>
            </Link>
          ))
        ) : (
          <p className="no-categories-message">No categories defined to display.</p>
        )}
      </div>
    </div>
  );
}

export default CategoriesPage;