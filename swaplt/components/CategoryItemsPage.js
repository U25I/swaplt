import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import "./CategoryItemsPage.css"; // Ensure this path is correct!

// Corrected Dummy data: Each entry represents an individual item to be displayed,
// even if they share similar names but different images.
// ALL locations are within Karnataka, and all specified fields are added.
const categoryData = {
    Clothes: [
        {
            id: 'polo-rl-green', // Unique ID for each individual item (image)
            name: "RALPH LAUREN POLO LONGSLEEVES (Green)",
            time: "11 months ago",
            images: ["/images/polo1.jpg"], // Individual image
            location: "Bengaluru, Karnataka, India",
            distance: "5.26 km away",
            views: 12,
            likes: 2,
            condition: "Used - Good",
            description: "Ralph Lauren long sleeve polo in green. Classic fit, minor fading."
        },
        {
            id: 'polo-rl-blue', // Unique ID
            name: "RALPH LAUREN POLO LONGSLEEVES (Blue)",
            time: "11 months ago",
            images: ["/images/polo2.jpg"], // Individual image
            location: "Mysuru, Karnataka, India",
            distance: "5.30 km away",
            views: 10,
            likes: 1,
            condition: "Used - Fair",
            description: "Ralph Lauren long sleeve polo in blue. Slightly worn, no tears."
        },
        {
            id: 'polo-rl-red', // Unique ID
            name: "RALPH LAUREN POLO LONGSLEEVES (Red)",
            time: "11 months ago",
            images: ["/images/polo3.jpg"], // Individual image
            location: "Mangaluru, Karnataka, India",
            distance: "5.40 km away",
            views: 15,
            likes: 3,
            condition: "Used - Excellent",
            description: "Ralph Lauren long sleeve polo in red. Barely worn, vibrant color."
        },
        {
            id: 'polo-rl-black', // Unique ID
            name: "RALPH LAUREN POLO LONGSLEEVES (Black)",
            time: "11 months ago",
            images: ["/images/polo4.jpg"], // Individual image
            location: "Hubballi, Karnataka, India",
            distance: "5.50 km away",
            views: 18,
            likes: 4,
            condition: "Used - Good",
            description: "Ralph Lauren long sleeve polo in black. Versatile, suitable for casual wear."
        },
        {
            id: 'tee-smiley-white', // Unique ID
            name: "13DE MARZO x SMILEY TEE SHIRT (White)",
            time: "11 months ago",
            images: ["/images/tee1.jpg"], // Individual image
            location: "Davanagere, Karnataka, India",
            distance: "7.85 km away",
            views: 11,
            likes: 0,
            condition: "New with tags",
            description: "White 13DE MARZO x SMILEY TEE SHIRT. Oversized fit, perfect condition."
        },
        {
            id: 'tee-smiley-black', // Unique ID
            name: "13DE MARZO x SMILEY TEE SHIRT (Black)",
            time: "11 months ago",
            images: ["/images/tee2.jpg"], // Individual image
            location: "Shivamogga, Karnataka, India",
            distance: "7.90 km away",
            views: 9,
            likes: 0,
            condition: "New with tags",
            description: "Black 13DE MARZO x SMILEY TEE SHIRT. Unworn, comfortable fabric."
        },
        {
            id: 'tee-smiley-yellow', // Unique ID
            name: "13DE MARZO x SMILEY TEE SHIRT (Yellow)",
            time: "11 months ago",
            images: ["/images/tee3.jpg"], // Individual image
            location: "Tumakuru, Karnataka, India",
            distance: "8.00 km away",
            views: 13,
            likes: 1,
            condition: "New",
            description: "Yellow 13DE MARZO x SMILEY TEE SHIRT. Never used, no tags."
        },
        {
            id: 'tee-smiley-blue', // Unique ID
            name: "13DE MARZO x SMILEY TEE SHIRT (Blue)",
            time: "11 months ago",
            images: ["/images/tee4.jpg"], // Individual image
            location: "Ballari, Karnataka, India",
            distance: "8.10 km away",
            views: 10,
            likes: 0,
            condition: "New",
            description: "Blue 13DE MARZO x SMILEY TEE SHIRT. Freshly laundered, unworn."
        },
        {
            id: 'jeans-designer-1', // Unique ID
            name: "Designer Jeans",
            time: "2 days ago",
            images: ["/images/jeans1.jpg"],
            location: "Udupi, Karnataka, India",
            distance: "1.5 km away",
            views: 45,
            likes: 8,
            condition: "Excellent",
            description: "Premium brand denim jeans, straight fit, dark wash. Worn a couple of times."
        },
    ],
    Electronics: [
        {
            id: 'laptop-gaming-front', // Unique ID
            name: "Gaming Laptop (Front View)",
            time: "1 week ago",
            images: ["/images/laptop1.jpg"], // Individual image
            location: "Hassan, Karnataka, India",
            distance: "1.2 km away",
            views: 50,
            likes: 10,
            condition: "Used - Good",
            description: "High-performance gaming laptop, front view. Good condition."
        },
        {
            id: 'laptop-gaming-keyboard', // Unique ID
            name: "Gaming Laptop (Keyboard)",
            time: "1 week ago",
            images: ["/images/laptop2.jpg"], // Individual image
            location: "Vijayapura, Karnataka, India",
            distance: "1.3 km away",
            views: 48,
            likes: 9,
            condition: "Used - Good",
            description: "High-performance gaming laptop, close-up of keyboard. All keys functional."
        },
        {
            id: 'laptop-gaming-side', // Unique ID
            name: "Gaming Laptop (Side View)",
            time: "1 week ago",
            images: ["/images/laptop3.jpg"], // Individual image
            location: "Kolar, Karnataka, India",
            distance: "1.4 km away",
            views: 45,
            likes: 8,
            condition: "Used - Good",
            description: "High-performance gaming laptop, side view showing ports. Minor scuffs."
        },
        {
            id: 'laptop-gaming-back', // Unique ID
            name: "Gaming Laptop (Back View)",
            time: "1 week ago",
            images: ["/images/laptop4.jpg"], // Individual image
            location: "Chitradurga, Karnataka, India",
            distance: "1.5 km away",
            views: 42,
            likes: 7,
            condition: "Used - Good",
            description: "High-performance gaming laptop, back view. Ventilation clear."
        },
        {
            id: 'smartwatch-display', // Unique ID
            name: "Smartwatch (Fitness Tracker - Display)",
            time: "3 days ago",
            images: ["/images/smartwatch1.jpg"], // Individual image
            location: "Ramanagara, Karnataka, India",
            distance: "2.1 km away",
            views: 30,
            likes: 7,
            condition: "Like New",
            description: "Advanced fitness tracker, display view. No scratches on screen."
        },
        {
            id: 'smartwatch-back', // Unique ID
            name: "Smartwatch (Fitness Tracker - Back)",
            time: "3 days ago",
            images: ["/images/smartwatch2.jpg"], // Individual image
            location: "Chikkamagaluru, Karnataka, India",
            distance: "2.2 km away",
            views: 28,
            likes: 6,
            condition: "Like New",
            description: "Advanced fitness tracker, back view with sensor. Fully functional."
        },
        {
            id: 'smartwatch-box', // Unique ID
            name: "Smartwatch (Fitness Tracker - Box)",
            time: "3 days ago",
            images: ["/images/smartwatch3.jpg"], // Individual image
            location: "Kodagu, Karnataka, India",
            distance: "2.3 km away",
            views: 25,
            likes: 5,
            condition: "Like New",
            description: "Advanced fitness tracker, original box included. All accessories present."
        },
    ],
    "Home Needs": [
        {
            id: 'lamp-vintage-lit', // Unique ID
            name: "Vintage Table Lamp (Lit)",
            time: "3 weeks ago",
            images: ["/images/lamp1.jpg"], // Individual image
            location: "Bidar, Karnataka, India",
            distance: "800 meters away",
            views: 30,
            likes: 5,
            condition: "Good",
            description: "Classic design table lamp, shown lit. Fully functional, warm glow."
        },
        {
            id: 'lamp-vintage-off', // Unique ID
            name: "Vintage Table Lamp (Off)",
            time: "3 weeks ago",
            images: ["/images/lamp2.jpg"], // Individual image
            location: "Kalaburagi, Karnataka, India",
            distance: "810 meters away",
            views: 28,
            likes: 4,
            condition: "Good",
            description: "Classic design table lamp, shown unlit. Solid base, no major defects."
        },
        {
            id: 'lamp-vintage-detail', // Unique ID
            name: "Vintage Table Lamp (Detail)",
            time: "3 weeks ago",
            images: ["/images/lamp3.jpg"], // Individual image
            location: "Belagavi, Karnataka, India",
            distance: "820 meters away",
            views: 25,
            likes: 3,
            condition: "Good",
            description: "Close-up of vintage table lamp base. Intricate design, well-maintained."
        },
        {
            id: 'coffeemaker-front', // Unique ID
            name: "Coffee Maker (Barely Used - Front)",
            time: "5 days ago",
            images: ["/images/coffeemaker1.jpg"], // Individual image
            location: "Bagalkot, Karnataka, India",
            distance: "3.0 km away",
            views: 22,
            likes: 3,
            condition: "Like New",
            description: "Espresso machine, front view. Clean and ready to use."
        },
        {
            id: 'coffeemaker-side', // Unique ID
            name: "Coffee Maker (Barely Used - Side)",
            time: "5 days ago",
            images: ["/images/coffeemaker2.jpg"], // Individual image
            location: "Gadag, Karnataka, India",
            distance: "3.1 km away",
            views: 20,
            likes: 2,
            condition: "Like New",
            description: "Espresso machine, side view showing water reservoir. No leaks."
        },
    ],
   "Books": [
        {
            id: 'calcbook-3-cover', // Unique ID
            name: "Calculus III Textbook (Cover)",
            time: "1 month ago",
            images: ["/images/calcbook1.jpg"], // Individual image
            location: "Koppal, Karnataka, India",
            distance: "500 meters away",
            views: 60,
            likes: 15,
            condition: "Fair",
            description: "Calculus III textbook, front cover. Some wear on edges."
        },
        {
            id: 'calcbook-3-open', // Unique ID
            name: "Calculus III Textbook (Open)",
            time: "1 month ago",
            images: ["/images/book4.jpg"], // Individual image
            location: "Raichur, Karnataka, India",
            distance: "510 meters away",
            views: 55,
            likes: 14,
            condition: "Fair",
            description: "Calculus III textbook, open to a chapter. Some highlighting."
        },
        {
            id: 'calcbook-3-spine', // Unique ID
            name: "Calculus III Textbook (Spine)",
            time: "1 month ago",
            images: ["/images/book3.jpg"], // Individual image
            location: "Yadgir, Karnataka, India",
            distance: "520 meters away",
            views: 50,
            likes: 13,
            condition: "Fair",
            description: "Calculus III textbook, spine view. Binding intact."
        },
        {
            id: 'psychbook-intro-1', // Unique ID
            name: "Introduction to Psychology (Cover)",
            time: "2 weeks ago",
            images: ["/images/book2.jpg"],
            location: "Chamarajanagar, Karnataka, India",
            distance: "1.8 km away",
            views: 40,
            likes: 9,
            condition: "Good",
            description: "Introduction to Psychology textbook, clean cover. Great for beginners."
        },
    ],
    "Furniture": [
        {
            id: 'desk-study-1', // Unique ID
            name: "Study Desk",
            time: "3 weeks ago",
            images: ["/images/desk1.jpg"],
            location: "Hassan, Karnataka, India",
            distance: "2.5 km away",
            views: 50,
            likes: 10,
            condition: "Used - Good",
            description: "Compact wooden study desk with a drawer. Ideal for small spaces."
        },
        {
            id: 'bedframe-queen-1', // Unique ID
            name: "Queen Size Bed Frame",
            time: "1 month ago",
            images: ["/images/bedframe1.jpg"],
            location: "Vijayapura, Karnataka, India",
            distance: "4.0 km away",
            views: 70,
            likes: 15,
            condition: "Excellent",
            description: "Sturdy metal bed frame, easy to assemble. No mattress included."
        }
    ],
    "Food Donation": [
        {
            id: 'veggies-fresh-1', // Unique ID
            name: "Fresh Pepper",
            time: "2 days", // Matches screenshot
            images: ["/images/apples.jpg"], // Placeholder, use actual pepper image
            location: "Bengaluru, India", // Matches screenshot
            distance: "3.91 KM away", // Matches screenshot
            views: 120,
            likes: 30,
            condition: "Fresh", // Matches screenshot
            description: "Mixed bag of fresh vegetables, including spinach, tomatoes, and carrots. From a local garden."
        },
        {
            id: 'cannedgoods-assort-1', // Unique ID
            name: "Maize",
            time: "1 day", // Matches screenshot
            images: ["/images/bread.jpg"], // Placeholder, use actual corn image
            location: "Mysuru, India", // Matches screenshot
            distance: "502.74 meters away", // Matches screenshot
            views: 100,
            likes: 28,
            condition: "Good", // Matches screenshot
            description: "Variety of canned foods (beans, corn, tuna), unopened and within expiry date."
        },
        {
            id: 'artisan-bread-1', // Unique ID
            name: "Artisan Bread",
            time: "3 days", // Matches screenshot
            images: ["/images/bread.jpg"], // Actual bread image
            location: "Mangaluru, India", // Matches screenshot
            distance: "1.2 KM away", // Matches screenshot
            views: 80,
            likes: 20,
            condition: "Freshly Baked", // Matches screenshot
            description: "Freshly baked artisan sourdough bread. Perfect for sandwiches or toast."
        },
        {
            id: 'red-apples-1', // Unique ID
            name: "Red Apples",
            time: "5 hours", // Matches screenshot
            images: ["/images/apples.jpg"], // Actual apples image
            location: "Hubballi, India", // Matches screenshot
            distance: "800 meters away", // Matches screenshot
            views: 90,
            likes: 25,
            condition: "Excellent", // Matches screenshot
            description: "Crisp and juicy red apples, freshly picked. Great for snacks or baking."
        },
    ],
    "Agriculture & Farming": [
        {
            id: 'gardentools-set-1', // Unique ID
            name: "Used Garden Tools Set",
            time: "4 weeks ago",
            images: ["/images/gardentools1.jpg"],
            location: "Ramanagara, Karnataka, India",
            distance: "10 km away",
            views: 35,
            likes: 6,
            condition: "Good",
            description: "Set of essential gardening tools: trowel, rake, pruners. Well-maintained."
        },
        {
            id: 'fertilizer-organic-1', // Unique ID
            name: "Organic Fertilizer Bags",
            time: "1 month ago",
            images: ["/images/fertilizer1.jpg"],
            location: "Chikkamagaluru, Karnataka, India",
            distance: "8 km away",
            views: 28,
            likes: 4,
            condition: "New",
            description: "Two 10kg bags of organic compost fertilizer, great for healthy plant growth."
        },
    ],
    "Vehicles": [
        {
            id: 'scooter-electric-1', // Unique ID
            name: "Electric Scooter",
            time: "3 days ago",
            images: ['/images/bike1.jpg'],
            location: 'Mangaluru, Karnataka, India',
            distance: '1.2 km away',
            views: 90,
            likes: 15,
            condition: 'Like New',
            description: 'Brand new electric scooter, ideal for short distances and eco-friendly commutes. Excellent battery life.',
        },
        {
            id: 'bicycle-hybrid-1', // Unique ID
            name: "Hybrid Bicycle",
            time: "4 days ago",
            images: ['/images/bike2.jpg'],
            location: 'Hubballi, Karnataka, India',
            distance: '2.5 km away',
            views: 65,
            likes: 10,
            condition: 'Fair',
            description: 'Basic hybrid bicycle, suitable for leisure rides and light trails. Needs tire replacement and minor adjustments.',
        },
        {
            id: 'bicycle-hybrid-2', // Unique ID for the third bicycle image
            name: "Hybrid Bicycle (Side View)",
            time: "4 days ago",
            images: ['/images/bike3.jpg'],
            location: 'Hubballi, Karnataka, India',
            distance: '2.6 km away',
            views: 60,
            likes: 9,
            condition: 'Fair',
            description: 'Another view of the hybrid bicycle, showing the frame and gearing. Good for spare parts or project.',
        },
    ],
    Others: [
        {
            id: 'crafts-assorted-1', // Unique ID
            name: "Assorted Craft Supplies",
            time: "6 days ago",
            images: ["/images/crafts1.jpg"],
            location: "Kodagu, Karnataka, India",
            distance: "2.5 km away",
            views: 18,
            likes: 2,
            condition: "Mixed",
            description: "Box of various craft items: paints, brushes, beads, fabrics. Ideal for hobbyists."
        },
        {
            id: 'toys-vintage-1', // Unique ID
            name: "Collectibles (Vintage Toys)",
            time: "2 months ago",
            images: ["/images/toys1.jpg"],
            location: "Bidar, Karnataka, India",
            distance: "3.0 km away",
            views: 55,
            likes: 12,
            condition: "Fair",
            description: "Collection of vintage action figures from the 90s. Some items have original packaging."
        },
    ],
};

function CategoryItemsPage() {
    const { categoryName } = useParams();
    const navigate = useNavigate();

    const displayCategoryName = decodeURIComponent(categoryName || '');
    const itemsToDisplay = categoryData[displayCategoryName] || [];

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <div className="category-items-container">
            <header className="category-items-header">
                <button onClick={handleBackClick} className="back-button">
                    <IoIosArrowBack />
                </button>
                <h2>{displayCategoryName}</h2>
            </header>
            <div className="items-list"> {/* This is the horizontal scrolling container */}
                {itemsToDisplay.length > 0 ? (
                    itemsToDisplay.map((item) => (
                        <div className="item-card" key={item.id}>
                            {/* Image section */}
                            <div className="item-image-single">
                                <img
                                    src={item.images[0]} // Always display the first image
                                    alt={item.name}
                                    // Fallback image with 4:3 aspect ratio (250x188)
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/250x188/cccccc/333333?text=No+Image"; }}
                                />
                            </div>
                            {/* Item Name */}
                            <div className="item-card-header">
                                <h3>{item.name} <span>{item.time}</span> {/* Time is hidden via CSS */}</h3>
                            </div>

                            {/* Item Details (Category, Condition, Location, Distance) */}
                            <p className="item-details">
                                <span className="detail-label">Category:</span> {displayCategoryName}
                            </p>
                            <p className="item-details">
                                <span className="detail-label">Condition:</span> {item.condition}
                            </p>
                            <p className="item-location">📍 {item.location}</p>
                            <p className="item-distance">{item.distance}</p>

                            {/* Description and Stats are hidden via CSS to match screenshot */}
                            <p className="item-description">{item.description}</p>
                            <div className="item-stats">
                                <span>👁️ {item.views} views</span>
                                <span>❤️ {item.likes} likes</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-items-message">No items found for {displayCategoryName}.</p>
                )}
            </div>
        </div>
    );
}

export default CategoryItemsPage;