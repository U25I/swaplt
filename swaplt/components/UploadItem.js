// src/components/UploadItem.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUpload } from 'react-icons/fa';
import './UploadItem.css'; // Your CSS file for this component

function UploadItem() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const fileInputRef = useRef(null);

    // Form state - matching your provided fields and initial values
    const [formData, setFormData] = useState({
        itemName: '',
        itemDescription: '',
        itemCategory: '',
        itemQuantity: '1', // Default to 1
        itemDimensions: '', // New field
        itemCondition: 'New', // Default to 'New'
        location: '',
        exchangeReason: '', // New field
        pickupOptions: ['Shipping Available'], // Array for checkboxes, default to one option
        desiredItem: '', // New field
        exchangeMethod: 'Giveaway (Free)' // Default method
    });

    const [images, setImages] = useState([]); // State to hold selected image files

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Handle pickup options checkboxes
            setFormData(prevFormData => {
                let updatedOptions = prevFormData.pickupOptions;
                if (checked) {
                    updatedOptions = [...updatedOptions, value];
                } else {
                    updatedOptions = updatedOptions.filter(opt => opt !== value);
                }
                return { ...prevFormData, pickupOptions: updatedOptions };
            });
        } else {
            setFormData(prevFormData => ({ ...prevFormData, [name]: value }));
        }
        setError(null); // Clear error on input change
        setSuccessMessage(null); // Clear success on input change
    };

    const handleImageChange = (e) => {
        // Concatenate new files with existing ones
        const newFiles = Array.from(e.target.files);
        setImages(prevImages => [...prevImages, ...newFiles]);
        setError(null); // Clear error on image change
        setSuccessMessage(null); // Clear success on image change
    };

    const handleRemoveImage = (indexToRemove) => {
        setImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const userId = localStorage.getItem('userId');
        if (!userId) {
            setError('You must be logged in to upload items. Please log in.');
            setLoading(false);
            return;
        }

        // Basic form validation
        if (!formData.itemName.trim() || !formData.itemDescription.trim() ||
            !formData.itemCategory.trim() || !formData.itemQuantity.trim() ||
            !formData.itemCondition.trim() || !formData.location.trim() ||
            formData.pickupOptions.length === 0 || !formData.exchangeMethod.trim()) {
            setError('Please fill in all required fields marked with *');
            setLoading(false);
            return;
        }

        if (images.length === 0) {
            setError('Please upload at least one image of your item.');
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();

        // Append all text fields
        formDataToSend.append('user_id', userId);
        formDataToSend.append('itemName', formData.itemName);
        formDataToSend.append('itemDescription', formData.itemDescription);
        formDataToSend.append('itemCategory', formData.itemCategory);
        formDataToSend.append('itemQuantity', formData.itemQuantity);
        formDataToSend.append('itemDimensions', formData.itemDimensions); // Can be empty
        formDataToSend.append('itemCondition', formData.itemCondition);
        formDataToSend.append('location', formData.location);
        formDataToSend.append('exchangeReason', formData.exchangeReason); // Can be empty
        // Append each selected pickup option
        formData.pickupOptions.forEach(opt => {
            formDataToSend.append('pickupOptions[]', opt);
        });
        formDataToSend.append('desiredItem', formData.desiredItem); // Can be empty
        formDataToSend.append('exchangeMethod', formData.exchangeMethod);

        // Append images
        images.forEach(image => {
            formDataToSend.append('images[]', image); // 'images[]' should match your PHP script's expected array name for files
        });

        try {
            const response = await fetch('http://localhost:8080/backend/api/upload_item.php', {
                method: 'POST',
                body: formDataToSend,
                // Do NOT set 'Content-Type': 'multipart/form-data'. The browser does this automatically
                // and includes the necessary 'boundary' string.
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setSuccessMessage('Item uploaded successfully!');
                // Clear the form after successful submission
                setFormData({
                    itemName: '',
                    itemDescription: '',
                    itemCategory: '',
                    itemQuantity: '1',
                    itemDimensions: '',
                    itemCondition: 'New',
                    location: '',
                    exchangeReason: '',
                    pickupOptions: ['Shipping Available'],
                    desiredItem: '',
                    exchangeMethod: 'Giveaway (Free)'
                });
                setImages([]);
                if (fileInputRef.current) {
                    fileInputRef.current.value = ''; // Clear the file input element
                }
                // --- THIS IS THE CORRECTED LINE ---
                setTimeout(() => navigate('/myitems'), 1500); // Redirect to /myitems (no hyphen) after a short delay
                // ----------------------------------
            } else {
                setError(result.message || 'Failed to upload item. Please try again.');
            }
        } catch (err) {
            console.error("Upload error:", err);
            setError('Network error or server unreachable: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="upload-item-container">
            <header className="upload-item-header">
                <button type="button" className="back-button" onClick={() => navigate(-1)} disabled={loading}>
                    <FaArrowLeft className="arrow-icon" />
                </button>
                <h2>List New Item</h2>
                <div className="spacer"></div>
            </header>

            <main className="upload-item-form">
                <form onSubmit={handleSubmit}>
                    {error && <p className="submission-status error">{error}</p>}
                    {successMessage && <p className="submission-status success">{successMessage}</p>}

                    {/* Item Name */}
                    <section className="form-section">
                        <label htmlFor="itemName">Item Name*</label>
                        <input
                            type="text"
                            id="itemName"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="e.g., Antique Wooden Chair"
                        />
                    </section>

                    {/* Description */}
                    <section className="form-section">
                        <label htmlFor="itemDescription">Description*</label>
                        <textarea
                            id="itemDescription"
                            name="itemDescription"
                            rows="4"
                            value={formData.itemDescription}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Provide a detailed description of the item, including any flaws."
                        ></textarea>
                    </section>

                    {/* Category */}
                    <section className="form-section">
                        <label htmlFor="itemCategory">Category*</label>
                        <select
                            id="itemCategory"
                            name="itemCategory"
                            value={formData.itemCategory}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Books">Books</option>
                            <option value="Home Decor">Home Decor</option>
                            <option value="Appliances">Appliances</option>
                            <option value="Sports & Outdoors">Sports & Outdoors</option>
                            <option value="Toys & Games">Toys & Games</option>
                            <option value="Collectibles">Collectibles</option>
                            <option value="Other">Other</option>
                        </select>
                    </section>

                    {/* Quantity & Condition (using form-row for horizontal layout) */}
                    <section className="form-section">
                        <div className="form-row" style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="itemQuantity">Quantity*</label>
                                <input
                                    type="number"
                                    id="itemQuantity"
                                    name="itemQuantity"
                                    min="1"
                                    value={formData.itemQuantity}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div className="form-group" style={{ flex: 1 }}>
                                <label htmlFor="itemCondition">Condition*</label>
                                <select
                                    id="itemCondition"
                                    name="itemCondition"
                                    value={formData.itemCondition}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    <option value="New">New</option>
                                    <option value="Used - Like New">Used - Like New</option>
                                    <option value="Used - Good">Used - Good</option>
                                    <option value="Used - Fair">Used - Fair</option>
                                    <option value="Used - Poor">Used - Poor (For Parts/Repair)</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Item Dimensions (optional) */}
                    <section className="form-section">
                        <label htmlFor="itemDimensions">Dimensions (Optional)</label>
                        <input
                            type="text"
                            id="itemDimensions"
                            name="itemDimensions"
                            value={formData.itemDimensions}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="e.g., 20x15x10 cm (LxWxH)"
                        />
                    </section>

                    {/* Location */}
                    <section className="form-section">
                        <label htmlFor="location">Location*</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="e.g., Bengaluru, Karnataka"
                        />
                    </section>

                    {/* Reason for Exchange (optional) */}
                    <section className="form-section">
                        <label htmlFor="exchangeReason">Reason for Exchange (Optional)</label>
                        <input
                            type="text"
                            id="exchangeReason"
                            name="exchangeReason"
                            value={formData.exchangeReason}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="Why are you exchanging this item?"
                        />
                    </section>

                    {/* Pickup Options */}
                    <section className="form-section">
                        <label>Pickup Options*</label>
                        <div className="checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    name="pickupOptions"
                                    value="Local Pickup Available"
                                    checked={formData.pickupOptions.includes('Local Pickup Available')}
                                    onChange={handleChange}
                                    disabled={loading}
                                /> Local Pickup Available
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="pickupOptions"
                                    value="Shipping Available"
                                    checked={formData.pickupOptions.includes('Shipping Available')}
                                    onChange={handleChange}
                                    disabled={loading}
                                /> Shipping Available
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="pickupOptions"
                                    value="Willing to Deliver"
                                    checked={formData.pickupOptions.includes('Willing to Deliver')}
                                    onChange={handleChange}
                                    disabled={loading}
                                /> Willing to Deliver (Local)
                            </label>
                        </div>
                    </section>

                    {/* Desired Item (optional) */}
                    <section className="form-section">
                        <label htmlFor="desiredItem">Desired Item (Optional)</label>
                        <input
                            type="text"
                            id="desiredItem"
                            name="desiredItem"
                            value={formData.desiredItem}
                            onChange={handleChange}
                            disabled={loading}
                            placeholder="What kind of item would you like in exchange?"
                        />
                    </section>

                    {/* Exchange Method */}
                    <section className="form-section">
                        <label htmlFor="exchangeMethod">Exchange Method*</label>
                        <select
                            id="exchangeMethod"
                            name="exchangeMethod"
                            value={formData.exchangeMethod}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        >
                            <option value="Giveaway (Free)">Giveaway (Free)</option>
                            <option value="Trade">Trade (for another item)</option>
                            <option value="Sell">Sell (Cash/Online Payment)</option>
                        </select>
                    </section>

                    {/* Image Upload Section */}
                    <section className="form-section image-upload-section">
                        <label>Images* (Max 5MB each)</label>
                        <div className="image-upload-box">
                            <div className="upload-area" onClick={triggerFileInput}>
                                <FaUpload className="plus-icon" />
                                <span>Upload Images</span>
                            </div>
                            {/* Hidden actual file input */}
                            <input
                                type="file"
                                id="itemImages"
                                name="itemImages"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                disabled={loading}
                            />
                            <div className="image-previews">
                                {images.map((file, index) => (
                                    <div key={index} className="preview-image-wrapper">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`Preview ${index}`}
                                            className="preview-image"
                                        />
                                        <button
                                            type="button"
                                            className="remove-image-button"
                                            onClick={() => handleRemoveImage(index)}
                                            disabled={loading}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {images.length > 0 && (
                            <p className="image-count" style={{ marginTop: 'var(--spacing-xs)', textAlign: 'right' }}>
                                {images.length} image(s) selected
                            </p>
                        )}
                    </section>

                    {/* Submit Button */}
                    <div className="form-navigation" style={{ paddingBottom: 'var(--spacing-lg)' }}>
                        <button type="submit" className="nav-button continue-button" disabled={loading}>
                            {loading ? 'Listing Item...' : 'List Item'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default UploadItem;