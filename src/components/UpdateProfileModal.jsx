import React, { useState, useEffect } from 'react';
import { FiX, FiEye, FiEyeOff, FiCamera, FiUser, FiPhone, FiMail, FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../css/UpdateProfileModal.css';

const UpdateProfileModal = ({ isOpen, onClose, userData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        profilePhoto: null
    });

    const [profilePreview, setProfilePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Pre-fill form with current user data when modal opens
    useEffect(() => {
        if (userData && isOpen) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
                password: '',
                profilePhoto: null
            });
            setProfilePreview(userData.profileUrl || null);
            setErrors({});
            setShowSuccess(false);
        }
    }, [userData, isOpen]);

    // Handle file upload
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, photo: 'Please select a valid image file' });
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, photo: 'Image size must be less than 5MB' });
                return;
            }

            setFormData({ ...formData, profilePhoto: file });

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfilePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear photo error if exists
            const newErrors = { ...errors };
            delete newErrors.photo;
            setErrors(newErrors);
        }
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear specific error when user starts typing
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Format phone number
    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, '');
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData({ ...formData, phone: formatted });

        if (errors.phone) {
            const newErrors = { ...errors };
            delete newErrors.phone;
            setErrors(newErrors);
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        // Phone validation
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (formData.phone && phoneDigits.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required to confirm changes';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            const userDataLocal = localStorage.getItem('user');
            if (!userDataLocal) {
                toast.error('Please login again');
                onClose();
                return;
            }

            const parsedData = JSON.parse(userDataLocal);
            const token = parsedData.token;

            // Prepare form data for submission
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone.replace(/\D/g, '')); // Send only digits
            submitData.append('password', formData.password);

            if (formData.profilePhoto) {
                submitData.append('profilePhoto', formData.profilePhoto);
            }

            // Make API call (adjust endpoint as per your backend)
            const response = await axios.put(
                'https://api.shopco.site/Auth/updateProfile',
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setShowSuccess(true);
                toast.success('Profile updated successfully!');

                // Call success callback to refresh user data
                if (onUpdateSuccess) {
                    onUpdateSuccess(response.data.user);
                }

                // Close modal after showing success message
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        } catch (error) {
            if (error.response?.status === 401 || error.response?.data?.message?.includes('password')) {
                setErrors({ ...errors, password: 'Incorrect password' });
                toast.error('Incorrect password');
            } else if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update profile. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                phone: '',
                email: '',
                password: '',
                profilePhoto: null
            });
            setProfilePreview(null);
            setErrors({});
            setShowSuccess(false);
            onClose();
        }
    };

    // Don't render if modal is not open
    if (!isOpen) return null;

    return (
        <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={handleCancel}>
            <div className={`modal-container ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button
                    className="modal-close-btn"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>

                {/* Success message */}
                {showSuccess && (
                    <div className="success-message-overlay">
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Profile Updated!</h3>
                            <p>Your changes have been saved successfully</p>
                        </div>
                    </div>
                )}

                {/* Modal header */}
                <div className="modal-header">
                    <h2>Update Profile</h2>
                    <p>Keep your information up to date</p>
                </div>

                {/* Profile photo section */}
                <div className="profile-photo-section">
                    <div className="profile-photo-preview">
                        {profilePreview ? (
                            <img src={profilePreview} alt="Profile" />
                        ) : (
                            <div className="profile-photo-placeholder">
                                <FiUser size={48} />
                            </div>
                        )}
                    </div>
                    <label htmlFor="photo-upload" className="change-photo-btn">
                        <FiCamera size={18} />
                        <span>Change Photo</span>
                        <input
                            id="photo-upload"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                            disabled={isSubmitting}
                        />
                    </label>
                    {errors.photo && <span className="error-text">{errors.photo}</span>}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="profile-form">
                    {/* Full Name */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                            <FiUser className="input-icon" />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter your full name"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    {/* Phone Number */}
                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                            <FiPhone className="input-icon" />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handlePhoneChange}
                                placeholder="(123) 456-7890"
                                maxLength={14}
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your email"
                                disabled={isSubmitting}
                            />
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    {/* Password Confirmation */}
                    <div className="form-group password-section">
                        <label htmlFor="password">Enter your password to confirm changes</label>
                        <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                            <FiLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isSubmitting}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {/* Action buttons */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Updating...
                                </>
                            ) : (
                                'Update Profile'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfileModal;
