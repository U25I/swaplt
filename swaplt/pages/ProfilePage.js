import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { IoIosArrowBack, IoMdCamera } from 'react-icons/io'; // Back arrow and camera icon
import { FaClipboardList, FaBell, FaHeart, FaBan, FaLanguage, FaHome, FaPlus, FaBook, FaCog, FaSignOutAlt } from 'react-icons/fa'; // All necessary icons
import { MdCategory } from 'react-icons/md';
import { LuClipboardList } from "react-icons/lu";

import './ProfilePage.css'; // Ensure this path is correct!

function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBackClick = () => {
        navigate(-1); // Go back to the previous page
    };

    // --- Click Handlers for Menu Items ---
    const handleMenuItemClick = (id) => {
        switch (id) {
            case 'my-items':
                // Corrected navigation path to match App.js route for MyItems
                navigate('/myitems'); // Route to your My Items page
                break;
            case 'notifications':
                alert('Navigating to Notifications page!');
                navigate('/notifications'); // Route to your Notifications page
                break;
            case 'favourites':
                alert('Navigating to Favourites page!');
                navigate('/favourites'); // Route to your Favourites page
                break;
            case 'blocked-items':
                alert('Navigating to Blocked Items page!');
                navigate('/blocked-items'); // Route to your Blocked Items page
                break;
            case 'language':
                alert('Choose your language:\n- English\n- Hindi\n- Kannada'); // Simple language selection instructions
                // In a real app, you'd open a language selection modal/page
                break;
            case 'terms':
                alert('Navigating to Terms and Conditions page!');
                navigate('/terms-and-conditions'); // Route to your Terms and Conditions page
                break;
            case 'settings':
                alert('Navigating to Settings page!');
                navigate('/settings'); // Route to your Settings page
                break;
            case 'logout':
                if (window.confirm('Are you sure you want to log out?')) {
                    alert('Logging out...');
                    // In a real app, you'd clear user session/token and navigate to login page
                    navigate('/login'); // Example: Navigate to login after logout
                }
                break;
            default:
                console.log(`Clicked on ${id}`);
        }
    };

    // Dummy data for menu items with the new click handlers
    const profileMenuItems = [
        { id: 'my-items', text: 'My Items', icon: FaClipboardList },
        { id: 'notifications', text: 'Notifications', icon: FaBell },
        { id: 'favourites', text: 'Favourites', icon: FaHeart },
        { id: 'blocked-items', text: 'Blocked items', icon: FaBan },
        { id: 'language', text: 'Language', icon: FaLanguage },
        { id: 'terms', text: 'Terms and conditions', icon: FaBook },
        { id: 'settings', text: 'Settings', icon: FaCog },
        { id: 'logout', text: 'Logout', icon: FaSignOutAlt, specialClass: 'logout-item' },
    ];

    return (
        <div className="profile-container">
            <header className="profile-header">
                <button onClick={handleBackClick} className="back-button">
                    <IoIosArrowBack />
                </button>
                <h2>Profile</h2>
            </header>

            <div className="profile-main-content">
                {/* Reinstated Profile Picture and Name/Email Section */}
                <div className="profile-header-section">
                    <div className="profile-pic-wrapper">
                        <div className="profile-pic-placeholder">R</div>
                        <div className="camera-icon-overlay">
                            <IoMdCamera />
                        </div>
                    </div>
                    <p className="profile-name">Rakshitha R</p>
                    <p className="profile-email">raraviravi258@gmail.com</p>
                </div>

                <div className="profile-menu">
                    {profileMenuItems.map(item => (
                        <div
                            className={`menu-item ${item.specialClass || ''}`}
                            key={item.id}
                            onClick={() => handleMenuItemClick(item.id)} // Add click handler
                        >
                            <div className="menu-item-left">
                                <span className="menu-icon"><item.icon /></span>
                                <span className="menu-text">{item.text}</span>
                            </div>
                            <span className="menu-arrow">{'>'}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Action Button (FAB) */}
            {/* You might want to make this FAB navigate to /upload-item */}
            <div className="floating-action-button">
                <FaPlus />
            </div>

            {/* Bottom Navigation Bar */}
            <nav className="bottom-nav">
                <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
                    <FaHome />
                    <span>Home</span>
                </Link>
                <Link to="/categories" className={`nav-item ${location.pathname === '/categories' ? 'active' : ''}`}>
                    <MdCategory />
                    <span>Categories</span>
                </Link>
                <div className="nav-item-placeholder"></div> {/* To occupy space for FAB */}
                {/* Ensure this bottom nav link also points to /myitems */}
                <Link to="/myitems" className={`nav-item ${location.pathname === '/myitems' ? 'active' : ''}`}>
                    <LuClipboardList />
                    <span>My Items</span>
                </Link>
                <Link to="/profile" className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
                    <FaClipboardList /> {/* Consider using FaUser or a more profile-specific icon here */}
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}

export default ProfilePage;
