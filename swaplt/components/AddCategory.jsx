// src/components/AddCategory.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './AddCategory.css'; // You'll create this CSS file next

function AddCategory() {
    const navigate = useNavigate();
    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!categoryName.trim() || !categoryDescription.trim()) {
            setError('Please fill in both category name and description.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', categoryName);
        formData.append('description', categoryDescription);

        try {
            const response = await fetch('http://localhost:8080/backend/api/add_category.php', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                setSuccessMessage('Category added successfully!');
                setCategoryName('');
                setCategoryDescription('');
                // Optional: Navigate back to dashboard or categories page after a delay
                setTimeout(() => navigate('/categories'), 1500); 
            } else {
                setError(result.message || 'Failed to add category. Please try again.');
            }
        } catch (err) {
            console.error('Error adding category:', err);
            setError('Network error or server unreachable. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-category-container">
            <header className="add-category-header">
                <button type="button" className="back-button" onClick={() => navigate(-1)} disabled={loading}>
                    <FaArrowLeft className="arrow-icon" />
                </button>
                <h2>Add New Category</h2>
                <div className="spacer"></div>
            </header>

            <main className="add-category-form-main">
                <form onSubmit={handleSubmit}>
                    {error && <p className="submission-status error">{error}</p>}
                    {successMessage && <p className="submission-status success">{successMessage}</p>}

                    <div className="form-group">
                        <label htmlFor="categoryName">Category Name*</label>
                        <input
                            type="text"
                            id="categoryName"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="e.g., Sports Equipment"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="categoryDescription">Description*</label>
                        <textarea
                            id="categoryDescription"
                            rows="4"
                            value={categoryDescription}
                            onChange={(e) => setCategoryDescription(e.target.value)}
                            placeholder="Provide a brief description of this category (e.g., items for sports and outdoor activities)."
                            required
                            disabled={loading}
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Category'}
                    </button>
                </form>
            </main>
        </div>
    );
}

export default AddCategory;