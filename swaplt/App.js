import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CategoriesPage from "./components/CategoriesPage";
import CategoryItemsPage from "./components/CategoryItemsPage";
import LandingPage from "./components/LandingPage";
import MyItems from "./components/MyItems"; // Corrected import path if it was wrong
import UploadItem from "./components/UploadItem";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import ProfilePage from "./pages/ProfilePage";
import AddCategory from "./components/AddCategory";

// Placeholder components for the new pages linked from ProfilePage
const NotificationsPage = () => <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>Notifications Page Content</h2><p>This is where your notifications would be displayed.</p></div>;
const FavouritesPage = () => <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>Favourites Page Content</h2><p>Your favourite items will appear here.</p></div>;
const BlockedItemsPage = () => <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>Blocked Items Page Content</h2><p>Items you have blocked will be listed here.</p></div>;
const TermsAndConditionsPage = () => <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>Terms and Conditions</h2><p>Here you would display your app's terms and conditions.</p><p>Please read them carefully.</p></div>;
const SettingsPage = () => <div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>Settings Page Content</h2><p>Adjust your app settings here.</p></div>;


function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // This useEffect simulates a login; in a real app, you'd manage actual auth.
    // It's also where you'd typically retrieve user data from localStorage after a successful login
    // and set it as loggedInUser for components that need it.
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // In a real app, fetch user details based on storedUserId
      setLoggedInUser({
        id: storedUserId,
        name: "John Doe", // Replace with actual fetched user data
        email: "john.doe@example.com", // Replace with actual fetched user data
      });
      console.log("Simulated login for:", storedUserId);
    }
  }, []); // Run once on component mount

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard user={loggedInUser} />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/category/:categoryName" element={<CategoryItemsPage />} />
        <Route path="/add-category" element={<AddCategory />} />

        {/* --- Profile Page and its associated routes --- */}
        <Route path="/profile" element={<ProfilePage />} /> {/* The main Profile Page */}

        {/* Routes for menu items within the ProfilePage */}
        {/* CORRECTED: Route path changed from "/my-items" to "/myitems" to match Dashboard.js */}
        {/* Removed "/my-items-bottom" as it's redundant */}
        <Route path="/myitems" element={<MyItems />} />

        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/blocked-items" element={<BlockedItemsPage />} />
        {/* Language option is handled via alert in ProfilePage.jsx, no dedicated route needed for now */}
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Logout typically redirects to login, which you already have */}

        {/* Your existing routes */}
        <Route path="/upload-item" element={<UploadItem />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />

        {/* Catch-all route for any undefined paths */}
        <Route path="*" element={<div style={{ padding: '40px', textAlign: 'center', fontSize: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}><h2>404 - Page Not Found</h2><p>The page you are looking for does not exist.</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
