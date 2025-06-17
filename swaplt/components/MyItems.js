// src/components/MyItems.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyItems.css'; // Ensure this CSS file is styled to match the screenshot

// You might need to install react-icons if you don't have it: npm install react-icons react-spinners
import { FaPlus, FaHome, FaThLarge, FaBox, FaUser, FaArrowLeft } from 'react-icons/fa';
import { SyncLoader } from 'react-spinners'; // For loading indicator

function MyItems() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('proposed'); // Default to 'Proposed Items'
    const [proposedItems, setProposedItems] = useState([]);
    const [uploadedItems, setUploadedItems] = useState([]); // These will be 'approved' items
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Main useEffect for fetching items based on logged-in user
    useEffect(() => {
        const fetchUserItems = async () => {
            setLoading(true);
            setError(null);

            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError("User not logged in. Please log in to view your items.");
                setLoading(false);
                // Optionally, redirect to login page if not logged in
                // navigate('/login');
                return;
            }

            try {
                // Fetch items for the logged-in user
                // Make sure your items.php supports user_id as a GET parameter
                // This assumes your items.php returns data in the format: { status: 'success', items: [...] }
                const response = await fetch(`http://localhost:8080/backend/api/items.php?user_id=${userId}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
                }

                const data = await response.json();

                if (data.status === 'success' && Array.isArray(data.items)) { // Ensure data.items is an array
                    // Filter items based on their status
                    const fetchedProposed = data.items.filter(item => item.status === 'proposed');
                    const fetchedApproved = data.items.filter(item => item.status === 'approved'); 
                    
                    setProposedItems(fetchedProposed);
                    setUploadedItems(fetchedApproved); 
                } else {
                    // Handle cases where data.items might not be an array or status is not success
                    setError(data.message || "Failed to fetch items or invalid data format.");
                    setProposedItems([]); // Clear previous items on error
                    setUploadedItems([]);
                }
            } catch (err) {
                console.error("Error fetching items:", err);
                setError(`Network error or failed to load items: ${err.message}`);
                setProposedItems([]); // Clear previous items on error
                setUploadedItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUserItems(); // Call the async function
    }, []); // Empty dependency array means this runs once on mount, fetching userId and then items

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/backend/api/items.php?item_id=${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
            });

            const result = await response.json();

            if (result.status === 'success') {
                alert('Item deleted successfully!');
                // Update state to remove the deleted item
                setProposedItems(prev => prev.filter(item => item.item_id !== itemId));
                setUploadedItems(prev => prev.filter(item => item.item_id !== itemId));
            } else {
                alert(`Failed to delete item: ${result.message}`);
                setError(result.message);
            }
        } catch (err) {
            console.error("Error deleting item:", err);
            alert(`An error occurred while deleting the item: ${err.message}`);
            setError(`Failed to delete item: ${err.message}`);
        }
    };

    const handleEditItem = (item) => {
        alert(`Edit functionality for item: "${item.item_name}" (ID: ${item.item_id}) is not fully implemented yet.`);
        // To implement edit, you would navigate to an edit page/form:
        // navigate(`/edit-item/${item.item_id}`, { state: { itemData: item } });
    };

    const handleAddClick = () => {
        navigate('/upload-item');
    };

    // Navigation handlers for the bottom bar
    const navigateToHome = () => navigate('/home'); // Assuming '/home' is your actual Home page route
    const navigateToCategories = () => navigate('/categories');
    const navigateToProfile = () => navigate('/profile');

    // Helper function to render item cards
    const renderItemCards = (items) => {
        if (!items || items.length === 0) {
            return (
                <section className="no-items-state">
                    <div className="no-items-illustration">
                        <img src="/images/no-items-folder.png" alt="No Items" className="no-items-folder-icon" />
                    </div>
                    <h2 className="no-items-message-title">No {activeTab === 'proposed' ? 'Proposed' : 'Approved'} Items Yet</h2>
                    <p className="no-items-message-description">
                        {activeTab === 'proposed'
                            ? 'Items you list will first appear here for review before being publicly listed.'
                            : 'Once your proposed items are approved, they will appear here.'}
                    </p>
                    <button onClick={handleAddClick} className="add-item-button">
                        <FaPlus className="add-item-icon" /> List New Item
                    </button>
                </section>
            );
        }

        return (
            <section className="items-list">
                {items.map(item => (
                    <div key={item.item_id} className="item-card">
                        <div className="item-images">
                            {/* Corrected image source path and added robust check */}
                            {item.image_paths && item.image_paths.length > 0 && item.image_paths[0] ? (
                                <img
                                    src={`http://localhost:8080/backend/uploads/${item.image_paths[0]}`}
                                    alt={item.item_name || 'Item image'}
                                    className="item-thumbnail"
                                    onError={(e) => { e.target.onerror = null; e.target.src="/images/default-item.jpg"; }}
                                />
                            ) : (
                                <div className="no-image-placeholder">No Image</div>
                            )}
                        </div>
                        <div className="item-details">
                            <h3>{item.item_name || 'Untitled Item'} <span className={`item-status ${item.status}`}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span></h3>
                            <p><strong>Category:</strong> {item.item_category || 'N/A'}</p>
                            <p><strong>Condition:</strong> {item.item_condition || 'N/A'}</p>
                            <p><strong>Location:</strong> {item.item_location || 'N/A'}</p>
                            <p><strong>Quantity:</strong> {item.item_quantity || 'N/A'}</p>
                            <p><strong>Exchange Method:</strong> {item.exchange_method || 'N/A'}</p>
                            {/* FIX: Safely access item.item_description before substring */}
                            <p className="item-description">
                                {item.item_description ? (
                                    `${item.item_description.substring(0, 100)}${item.item_description.length > 100 ? '...' : ''}`
                                ) : (
                                    'No description available.' // Fallback text
                                )}
                            </p>
                            <div className="item-actions">
                                <button onClick={() => handleEditItem(item)} className="edit-button">Edit</button>
                                <button onClick={() => handleDeleteItem(item.item_id)} className="delete-button">Delete</button>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        );
    };


    return (
        <div className="my-items-container">
            {/* Top Navigation Bar */}
            <header className="top-nav-bar">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FaArrowLeft />
                </button>
                <h1 className="page-title">My Items</h1>
                <div className="nav-right-spacer"></div> {/* For alignment */}
            </header>

            {/* Tab Navigation */}
            <nav className="my-items-tabs">
                <button
                    className={`tab-button ${activeTab === 'proposed' ? 'active' : ''}`}
                    onClick={() => setActiveTab('proposed')}
                >
                    Proposed Items ({proposedItems.length})
                </button>
                <button
                    className={`tab-button ${activeTab === 'uploaded' ? 'active' : ''}`}
                    onClick={() => setActiveTab('uploaded')}
                >
                    Approved Items ({uploadedItems.length}) {/* Renamed for clarity */}
                </button>
            </nav>

            {/* Content Area */}
            <main className="my-items-content">
                {loading ? (
                    <div className="loading-spinner">
                        <SyncLoader color={"#28a745"} loading={loading} size={15} />
                        <p>Loading items...</p>
                    </div>
                ) : error ? (
                    <p className="error-message-display">{error}</p>
                ) : (
                    <>
                        {activeTab === 'proposed' && renderItemCards(proposedItems)}
                        {activeTab === 'uploaded' && renderItemCards(uploadedItems)}
                    </>
                )}
            </main>

            {/* Bottom Navigation Bar */}
            <footer className="bottom-nav-bar">
                <button className="nav-item" onClick={navigateToHome}>
                    <FaHome /><span className="nav-item-text">Home</span>
                </button>
                <button className="nav-item" onClick={navigateToCategories}>
                    <FaThLarge /><span className="nav-item-text">Categories</span>
                </button>
                <button className="nav-item fab-button" onClick={handleAddClick}>
                    <FaPlus />
                </button>
                <button className="nav-item active">
                    <FaBox /><span className="nav-item-text">My Items</span>
                </button>
                <button className="nav-item" onClick={navigateToProfile}>
                    <FaUser /><span className="nav-item-text">Profile</span>
                </button>
            </footer>
        </div>
    );
}

export default MyItems;