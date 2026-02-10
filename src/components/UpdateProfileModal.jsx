import React, { useState, useEffect } from 'react';
import { FiX, FiCamera, FiUser, FiPhone, FiMail, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import apiClient from '../utils/apiClient';
import '../css/UpdateProfileModal.css';

const UpdateProfileModal = ({ isOpen, onClose, userData, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        profilePhoto: null
    });

    const [profilePreview, setProfilePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [verificationToken, setVerificationToken] = useState(null);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
    const [isSendingOtp, setIsSendingOtp] = useState(false);

    useEffect(() => {
        if (userData && isOpen) {
            setFormData({
                name: userData.name || '',
                phone: userData.phone || '',
                email: userData.email || '',
                profilePhoto: null
            });

            let initialPreview = null;
            if (userData.profileUrl) {
                if (userData.profileUrl.startsWith('http')) {
                    initialPreview = userData.profileUrl;
                } else {
                    const cleanPath = userData.profileUrl.replace(/^\/+/, '');
                    initialPreview = `${import.meta.env.VITE_API_KEY}/${cleanPath}`;
                }
            }
            setProfilePreview(initialPreview);

            setErrors({});
            setShowSuccess(false);

            resetOtpState();
        }

        return () => {
            if (profilePreview && typeof profilePreview === 'string' && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }
        };
    }, [userData, isOpen]);

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const resetOtpState = () => {
        setOtp('');
        setShowOtpInput(false);
        setIsOtpSent(false);
        setVerificationToken(null);
        setIsEmailVerified(false);
        setTimer(0);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrors({ ...errors, photo: 'Please select a valid image file' });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, photo: 'Image size must be less than 5MB' });
                return;
            }

            setFormData({ ...formData, profilePhoto: file });

            if (profilePreview && profilePreview.startsWith('blob:')) {
                URL.revokeObjectURL(profilePreview);
            }

            const previewUrl = URL.createObjectURL(file);
            setProfilePreview(previewUrl);

            const newErrors = { ...errors };
            delete newErrors.photo;
            setErrors(newErrors);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'email') {
            setIsEmailVerified(false);
            setVerificationToken(null);
            setShowOtpInput(false);
        }

        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

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

    const handleSendOtp = async () => {
        if (!formData.email) {
            setErrors({ ...errors, email: 'Email is required' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrors({ ...errors, email: 'Invalid email address' });
            return;
        }

        setIsSendingOtp(true);
        setIsSendingOtp(true);
        try {
            const response = await apiClient.post(
                `/Auth/send-update-otp`,
                { email: formData.email }
            );

            if (response.data.success) {
                toast.success('OTP sent successfully');
                setIsOtpSent(true);
                setShowOtpInput(true);
                setTimer(60);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP');
        } finally {
            setIsSendingOtp(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsVerifyingOtp(true);
        setIsVerifyingOtp(true);
        try {
            const response = await apiClient.post(
                `/Auth/verify-update-otp`,
                { email: formData.email, otp }
            );

            if (response.data.success) {
                toast.success('Email verified successfully');
                setVerificationToken(response.data.verificationToken);
                setIsEmailVerified(true);
                setShowOtpInput(false);
                setIsOtpSent(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        } finally {
            setIsVerifyingOtp(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        }

        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (formData.phone && phoneDigits.length !== 10) {
            newErrors.phone = 'Phone number must be 10 digits';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('phone', formData.phone.replace(/\D/g, ''));
            submitData.append('email', formData.email);

            if (!verificationToken) {
                toast.error("Please verify your email to update profile.");
                setIsSubmitting(false);
                return;
            }
            submitData.append('verificationToken', verificationToken);

            if (formData.profilePhoto) {
                submitData.append('profilePhoto', formData.profilePhoto);
            }

            const response = await apiClient.put(
                `/Auth/updateProfile`,
                submitData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                setShowSuccess(true);
                toast.success('Profile updated successfully!');

                if (onUpdateSuccess) {
                    onUpdateSuccess(response.data.user);
                }

                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        } catch (error) {
            console.error("Update Profile Error:", error);
            toast.error(error.response?.data?.message || 'Failed to update profile.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (!isSubmitting) {
            setFormData({
                name: '',
                phone: '',
                email: '',
                profilePhoto: null
            });
            setProfilePreview(null);
            setErrors({});
            setShowSuccess(false);
            resetOtpState();
            onClose();
        }
    };

    if (!isOpen) return null;

    const canSubmit = !isSubmitting && isEmailVerified;

    return (
        <div className={`update-modal-overlay ${isOpen ? 'show' : ''}`} onClick={handleCancel}>
            <div className={`update-modal-container ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>

                <button
                    className="update-modal-close-btn"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>

                {showSuccess && (
                    <div className="success-message-overlay">
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h3>Profile Updated!</h3>
                            <p>Your changes have been saved successfully</p>
                        </div>
                    </div>
                )}

                <div className="update-modal-header">
                    <h2>Update Profile</h2>
                    <p>Keep your information up to date</p>
                </div>

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

                <form onSubmit={handleSubmit} className="profile-form">
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
                                disabled={true}
                                style={{ paddingRight: '100px', cursor: 'not-allowed', opacity: 0.7 }}
                            />
                            {!isEmailVerified && (
                                <button
                                    type="button"
                                    className="verify-btn"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp || timer > 0}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        padding: '5px 10px',
                                        fontSize: '12px',
                                        backgroundColor: '#6c63ff',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        opacity: (isSendingOtp || timer > 0) ? 0.7 : 1
                                    }}
                                >
                                    {timer > 0 ? `Resend in ${timer}s` : (isSendingOtp ? 'Sending...' : 'Verify')}
                                </button>
                            )}
                            {isEmailVerified && (
                                <FiCheckCircle
                                    color="green"
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                    }}
                                />
                            )}
                        </div>
                        {errors.email && <span className="error-text">{errors.email}</span>}

                        {showOtpInput && !isEmailVerified && (
                            <div className="otp-section" style={{ marginTop: '10px' }}>
                                <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>Enter OTP sent to your email</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength={6}
                                        placeholder="000000"
                                        style={{
                                            width: '120px',
                                            padding: '8px',
                                            border: '1px solid #ddd',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            letterSpacing: '2px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isVerifyingOtp}
                                        style={{
                                            padding: '8px 15px',
                                            backgroundColor: '#28a745',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {isVerifyingOtp ? 'Verifying...' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="update-modal-actions">
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
                            disabled={!canSubmit}
                            style={{ opacity: !canSubmit ? 0.6 : 1, cursor: !canSubmit ? 'not-allowed' : 'pointer' }}
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
