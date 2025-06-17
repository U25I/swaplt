import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { FaBox } from 'react-icons/fa';

const Dashboard = ({ user }) => {
    const navigate = useNavigate();

    const [searchInput, setSearchInput] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [backendMessage, setBackendMessage] = useState('Loading message from backend...');
    const [backendError, setBackendError] = useState(null);

    // State to store dynamically fetched categories
    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState(null);

    // --- START FIX: Move these useMemo definitions BEFORE useEffect ---
    // Food Donations data (retained with enriched fields and Karnataka locations)
    const allFoodDonations = useMemo(() => [
        {
            id: 1,
            image: "/images/pepper.jpg",
            title: 'Fresh Pepper',
            category: 'Vegetables',
            condition: 'Fresh',
            location: 'Bengaluru, India',
            description: 'Organic fresh green peppers, perfect for cooking, from a local farm. Harvested this morning.',
            daysAgo: '2 days',
            distance: '3.91 KM away',
        },
        {
            id: 2,
            image: '/images/corn.jpg',
            title: 'Maize',
            category: 'Grains',
            condition: 'Good',
            location: 'Mysuru, India',
            description: 'Sweet corn, good for direct consumption or animal feed. Naturally grown.',
            daysAgo: '1 day',
            distance: '502.74 meters away',
        },
        {
            id: 3,
            image: '/images/bread.jpg',
            title: 'Artisan Bread',
            category: 'Baked Goods',
            condition: 'Freshly Baked',
            location: 'Mangaluru, India',
            description: 'Handmade sourdough bread, baked daily. Perfect for sandwiches or toast.',
            daysAgo: '3 days',
            distance: '1.2 KM away',
        },
        {
            id: 4,
            image: '/images/apples.jpg',
            title: 'Red Apples',
            category: 'Fruits',
            condition: 'Excellent',
            location: 'Hubballi, India',
            description: 'Crisp and juicy red apples, ideal for snacking or pies.',
            daysAgo: '5 hours',
            distance: '800 meters away',
        },
        {
            id: 5,
            image: '/images/rice.jpg',
            title: 'Basmati Rice (5kg)',
            category: 'Grains',
            condition: 'Unopened Pack',
            location: 'Davanagere, India',
            description: 'Brand new 5kg pack of premium Basmati rice, surplus from a recent event.',
            daysAgo: '1 week',
            distance: '4.5 KM away',
        },
    ], []);

    // Swappable Items data (retained with enriched fields and Karnataka locations)
    const allSwappableItems = useMemo(() => [
        {
            id: 1,
            image: '/images/laptop1.jpg',
            title: 'Laptop',
            category: 'Electronics',
            condition: 'Good',
            location: 'Bengaluru, India',
            description: 'A reliable laptop, suitable for everyday tasks and Browse. Minor wear and tear.',
        },
        {
            id: 2,
            image: '/images/laptop2.jpg',
            title: 'Laptop1',
            category: 'Electronics',
            condition: 'Used (Like New)',
            location: 'Mysuru, India',
            description: 'Powerful laptop for gaming and graphic design, comes with charger. Barely used.',
        },
        {
            id: 3,
            image: '/images/laptop3.jpg',
            title: 'Laptop2',
            category: 'Electronics',
            condition: 'Excellent',
            location: 'Mangaluru, India',
            description: 'Sleek and lightweight laptop, ideal for travel and remote work. Very good battery life.',
        },
        {
            id: 4,
            image: '/images/laptop4.jpg',
            title: 'Laptop3',
            category: 'Electronics',
            condition: 'Minor Scratches',
            location: 'Hubballi, India',
            description: 'Affordable laptop suitable for students, basic computing needs. Works perfectly despite scratches.',
        },
        {
            id: 5,
            image: '/images/bike1.jpg',
            title: 'Mountain Bike',
            category: 'Sports Equipment',
            condition: 'Used',
            location: 'Davanagere, India',
            description: 'Sturdy mountain bike, perfect for trail riding. Some rust on chain, but functional.',
        },
    ], []);
    // --- END FIX: Moved useMemo definitions ---

    const [filteredFoodDonations, setFilteredFoodDonations] = useState(allFoodDonations);
    const [filteredSwappableItems, setFilteredSwappableItems] = useState(allSwappableItems);

    useEffect(() => {
        // Effect to fetch categories from PHP backend
        const fetchCategories = async () => {
            try {
                const phpApiUrl = 'http://localhost:8080/backend/api/categories.php';

                const response = await fetch(phpApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data.status === 'success') {
                    setDynamicCategories(data.data);
                    setCategoriesError(null);
                } else {
                    setCategoriesError(data.message || 'Failed to fetch categories.');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategoriesError('Failed to load categories: ' + error.message);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();

        // Existing fetchBackendMessage and search filtering logic
        const fetchBackendMessage = async () => {
            try {
                const phpApiUrl = 'http://localhost:8080/backend/api/data.php';

                const response = await fetch(phpApiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Backend response:', data.message);
                setBackendMessage(data.message + ' (Timestamp: ' + data.timestamp + ')');
                setBackendError(null);
            } catch (error) {
                console.error('Error fetching from PHP backend:', error);
                setBackendError('Failed to fetch data from backend: ' + error.message);
                setBackendMessage('Error loading message.');
            }
        };

        fetchBackendMessage();

        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        // --- Use allFoodDonations and allSwappableItems here as they are now defined ---
        const newFilteredFoodDonations = allFoodDonations.filter(item =>
            item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.category && item.category.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.condition && item.condition.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.location && item.location.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.distance && item.distance.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredFoodDonations(newFilteredFoodDonations);

        const newFilteredSwappableItems = allSwappableItems.filter(item =>
            item.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            (item.description && item.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.category && item.category.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.condition && item.condition.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (item.location && item.location.toLowerCase().includes(lowerCaseSearchTerm))
        );
        setFilteredSwappableItems(newFilteredSwappableItems);

    }, [searchTerm, allFoodDonations, allSwappableItems]);


    // Handler for My Items button click (retained)
    const handleMyItemsClick = () => {
        navigate('/myitems');
    };

    // Handler for Add Category button click (retained)
    const handleAddCategoryClick = () => {
        navigate('/add-category');
    };

    // Input and Search handlers (retained)
    const handleInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleSearchClick = () => {
        setSearchTerm(searchInput);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSearchClick();
        }
    };

    // Avatar rendering (retained)
    const renderAvatar = () => {
        if (user && user.profilePhotoUrl) {
            return <img src={user.profilePhotoUrl} alt={`${user.name}'s profile`} className="profile-photo" />;
        } else if (user && user.email) {
            const initial = user.email.charAt(0).toUpperCase();
            return <div className="initials-avatar">{initial}</div>;
        }
        return null;
    };

    return (
        <div className="dashboard-container">
            {/* Greeting Section */}
            <div className="greeting-section">
                {renderAvatar()}
                <h1 className="greeting">Hi, {user ? user.name.split(' ')[0] : 'User1'} 👋</h1>
                {/* My Items Button */}
                <button className="my-items-dashboard-button" onClick={handleMyItemsClick}>
                    <FaBox className="my-items-icon" /> My Items
                </button>
            </div>

            {/* Original Slogan */}
            <h1 className="slogan">
                From BIN to WIN<br />
                Trade your waste in
            </h1>

            {/* Backend Connection Status */}
            <div className="backend-status-container">
                <h3>Backend Connection Status:</h3>
                {backendError ? (
                    <p className="status-message error">{backendError}</p>
                ) : (
                    <p className="status-message success">{backendMessage}</p>
                )}
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search anything..."
                    value={searchInput}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                />
                <button
                    className="search-button"
                    onClick={handleSearchClick}
                >
                    Search
                </button>
            </div>

            {/* Categories Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2>Categories</h2>
                {/* Add Category Button */}
                <button
                    className="add-category-button"
                    onClick={handleAddCategoryClick}
                    style={{
                        padding: '8px 15px',
                        backgroundColor: '#A2DAA2', // Light green color
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }}
                >
                    + Add New Category
                </button>
            </div>

            <div className="categories-grid">
                {categoriesLoading ? (
                    <p>Loading categories...</p>
                ) : categoriesError ? (
                    <p className="error-message">Error: {categoriesError}</p>
                ) : dynamicCategories.length > 0 ? (
                    dynamicCategories.map((category, index) => (
                        <Link to={`/category/${encodeURIComponent(category)}`} key={index} className="category-card-link">
                            <div className="category-card">
                                {category}
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>No categories found.</p>
                )}
                {/* Link for "See All" Categories */}
                <Link to="/categories" className="see-all-button-link">
                    <div className="category-card see-all-card">
                        See All
                    </div>
                </Link>
            </div>

            {/* Food Donations Section */}
            <h2>Food Donations</h2>
            <div className="items-display-grid">
                {filteredFoodDonations.length > 0 ? (
                    filteredFoodDonations.map((item) => (
                        <div className="item-card" key={item.id}>
                            <img src={item.image} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x112/cccccc/333333?text=No+Image"; }} />
                            <div className="item-info">
                                <p className="item-title">{item.title}</p>
                                <small>Category: {item.category}</small><br/>
                                <small>Condition: {item.condition}</small><br/>
                                <small>Location: {item.location}</small><br/>
                                {item.daysAgo && <small>{item.daysAgo}</small>}<br/>
                                {item.distance && <small>{item.distance}</small>}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No food donations match your search.</p>
                )}
            </div>

            {/* Swappable Items Section */}
            <h2>Swappable Items</h2>
            <div className="items-display-grid">
                {filteredSwappableItems.length > 0 ? (
                    filteredSwappableItems.map((item) => (
                        <div className="item-card" key={item.id}>
                            <img src={item.image} alt={item.title} onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x112/cccccc/333333?text=No+Image"; }} />
                            <div className="item-info">
                                <p className="item-title">{item.title}</p>
                                <small>Category: {item.category}</small><br/>
                                <small>Condition: {item.condition}</small><br/>
                                <small>Location: {item.location}</small><br/>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No swappable items match your search.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;