import React, { useState, useEffect } from 'react';
import {
    FiX, FiUser, FiPhone, FiHome, FiBriefcase,
    FiMapPin, FiMap, FiNavigation
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../css/AddAddressModal.css';

const AddAddressModal = ({ isOpen, onClose, onAddressAdded, addressLimit = 5, currentAddressCount = 0, editMode = false, addressData = null }) => {
    const [formData, setFormData] = useState({
        recipientName: '',
        contactNumber: '',
        alternateContact: '',
        houseNo: '',
        street: '',
        landmark: '',
        city: '',
        state: '',
        pinCode: '',
        country: 'India',
        addressType: 'Home',
        isDefault: false,
        saveForFuture: true
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Country list
    const countries = [
        'India', 'United States', 'United Kingdom', 'Canada',
        'Australia', 'Germany', 'France', 'Singapore', 'UAE', 'Other'
    ];

    // Indian states
    const indianStates = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
    ];

    // Reset form when modal opens or when addressData changes
    useEffect(() => {
        if (isOpen) {
            if (editMode && addressData) {
                // Pre-fill form with existing address data
                setFormData({
                    recipientName: addressData.name || '',
                    contactNumber: formatPhoneNumber(addressData.phone || ''),
                    alternateContact: addressData.altPhone ? formatPhoneNumber(addressData.altPhone) : '',
                    houseNo: addressData.houseNo || '',
                    street: addressData.street || '',
                    landmark: addressData.landmark || '',
                    city: addressData.city || '',
                    state: addressData.state || '',
                    pinCode: addressData.pincode || '',
                    country: addressData.country || 'India',
                    addressType: addressData.addressType || 'Home',
                    isDefault: addressData.isDefault || false,
                    saveForFuture: true
                });
            } else {
                resetForm();
            }
        }
    }, [isOpen, editMode, addressData]);

    const resetForm = () => {
        setFormData({
            recipientName: '',
            contactNumber: '',
            alternateContact: '',
            houseNo: '',
            street: '',
            landmark: '',
            city: '',
            state: '',
            pinCode: '',
            country: 'India',
            addressType: 'Home',
            isDefault: false,
            saveForFuture: true
        });
        setErrors({});
        setShowSuccess(false);
    };

    // Format phone number
    const formatPhoneNumber = (value) => {
        const phone = value.replace(/\D/g, '');
        if (phone.length <= 3) return phone;
        if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
    };

    // Auto-capitalize text
    const capitalizeText = (text) => {
        return text.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        let processedValue = value;

        // Auto-format phone numbers
        if (name === 'contactNumber' || name === 'alternateContact') {
            processedValue = formatPhoneNumber(value);
        }

        // Auto-capitalize city and state
        if (name === 'city' && value) {
            processedValue = capitalizeText(value);
        }

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : processedValue
        });

        // Clear error when user starts typing
        if (errors[name]) {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }
    };

    // Validate PIN code based on country
    const validatePinCode = (pinCode, country) => {
        const pin = pinCode.replace(/\s/g, '');

        if (country === 'India') {
            return /^\d{6}$/.test(pin);
        } else if (country === 'United States' || country === 'Canada') {
            return /^\d{5}(-\d{4})?$/.test(pin);
        } else if (country === 'United Kingdom') {
            return /^[A-Z]{1,2}\d{1,2}\s?\d[A-Z]{2}$/i.test(pin);
        }

        return pin.length >= 4 && pin.length <= 10;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        // Recipient Name
        if (!formData.recipientName.trim()) {
            newErrors.recipientName = 'Recipient name is required';
        } else if (formData.recipientName.trim().length < 2) {
            newErrors.recipientName = 'Name must be at least 2 characters';
        }

        // Contact Number
        const contactDigits = formData.contactNumber.replace(/\D/g, '');
        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (contactDigits.length !== 10) {
            newErrors.contactNumber = 'Contact number must be 10 digits';
        }

        // Alternate Contact (optional but validate if provided)
        if (formData.alternateContact) {
            const altDigits = formData.alternateContact.replace(/\D/g, '');
            if (altDigits.length !== 10) {
                newErrors.alternateContact = 'Alternate contact must be 10 digits';
            }
        }

        // House No
        if (!formData.houseNo.trim()) {
            newErrors.houseNo = 'House/Building number is required';
        }

        // Street
        if (!formData.street.trim()) {
            newErrors.street = 'Street/Area is required';
        }

        // City
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        // State
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        // PIN Code
        if (!formData.pinCode.trim()) {
            newErrors.pinCode = 'PIN/ZIP code is required';
        } else if (!validatePinCode(formData.pinCode, formData.country)) {
            if (formData.country === 'India') {
                newErrors.pinCode = 'PIN code must be 6 digits';
            } else {
                newErrors.pinCode = 'Invalid PIN/ZIP code format';
            }
        }

        // Country
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check address limit only for create mode
        if (!editMode && currentAddressCount >= addressLimit) {
            toast.error(`You can only save up to ${addressLimit} addresses. Please delete an existing address to add a new one.`);
            return;
        }

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

            // Prepare data for submission - matching backend model
            const submitData = {
                name: formData.recipientName.trim(),
                phone: formData.contactNumber.replace(/\D/g, ''),
                altPhone: formData.alternateContact ? formData.alternateContact.replace(/\D/g, '') : '',
                houseNo: formData.houseNo.trim(),
                street: formData.street.trim(),
                landmark: formData.landmark.trim(),
                city: formData.city.trim(),
                state: formData.state.trim(),
                pincode: formData.pinCode.trim(),
                country: formData.country,
                addressType: formData.addressType
            };

            let response;
            if (editMode && addressData) {
                // Update existing address
                response = await axios.put(
                    `https://api.shopco.site/Auth/updateAddress/${addressData.addressId}`,
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            } else {
                // Create new address
                response = await axios.post(
                    'https://api.shopco.site/Auth/createAddress',
                    submitData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            if (response.data.success) {
                setShowSuccess(true);
                toast.success(editMode ? 'Address updated successfully!' : 'Address added successfully!');

                // Call success callback
                if (onAddressAdded) {
                    onAddressAdded(response.data.address);
                }

                // Close modal after showing success message
                setTimeout(() => {
                    setShowSuccess(false);
                    onClose();
                }, 1500);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(editMode ? 'Failed to update address. Please try again.' : 'Failed to add address. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle cancel
    const handleCancel = () => {
        if (!isSubmitting) {
            resetForm();
            onClose();
        }
    };

    // Don't render if modal is not open
    if (!isOpen) return null;

    return (
        <div className={`address-modal-overlay ${isOpen ? 'show' : ''}`} onClick={handleCancel}>
            <div className={`address-modal-container ${isOpen ? 'show' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Close button */}
                <button
                    className="address-modal-close-btn"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    aria-label="Close modal"
                >
                    <FiX size={24} />
                </button>

                {/* Success message */}
                {showSuccess && (
                    <div className="address-success-overlay">
                        <div className="address-success-message">
                            <div className="address-success-icon">✓</div>
                            <h3>Address Added!</h3>
                            <p>Your address has been saved successfully</p>
                        </div>
                    </div>
                )}

                {/* Modal header */}
                <div className="address-modal-header">
                    <h2><FiMapPin className="header-icon" /> {editMode ? 'Edit Address' : 'Add New Address'}</h2>
                    <p>{editMode ? 'Update your address details' : `Enter complete address details for delivery (${currentAddressCount}/${addressLimit} addresses used)`}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="address-form">
                    {/* Two-column grid */}
                    <div className="address-form-grid">
                        {/* Recipient Name */}
                        <div className="address-form-group full-width">
                            <label htmlFor="recipientName">
                                Recipient Name <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.recipientName ? 'error' : ''}`}>
                                <FiUser className="address-input-icon" />
                                <input
                                    type="text"
                                    id="recipientName"
                                    name="recipientName"
                                    value={formData.recipientName}
                                    onChange={handleInputChange}
                                    placeholder="Enter full name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.recipientName && <span className="address-error-text">{errors.recipientName}</span>}
                        </div>

                        {/* Contact Number */}
                        <div className="address-form-group">
                            <label htmlFor="contactNumber">
                                Contact Number <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.contactNumber ? 'error' : ''}`}>
                                <FiPhone className="address-input-icon" />
                                <input
                                    type="tel"
                                    id="contactNumber"
                                    name="contactNumber"
                                    value={formData.contactNumber}
                                    onChange={handleInputChange}
                                    placeholder="(123) 456-7890"
                                    maxLength={14}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.contactNumber && <span className="address-error-text">{errors.contactNumber}</span>}
                        </div>

                        {/* Alternate Contact */}
                        <div className="address-form-group">
                            <label htmlFor="alternateContact">Alternate Contact</label>
                            <div className={`address-input-wrapper ${errors.alternateContact ? 'error' : ''}`}>
                                <FiPhone className="address-input-icon" />
                                <input
                                    type="tel"
                                    id="alternateContact"
                                    name="alternateContact"
                                    value={formData.alternateContact}
                                    onChange={handleInputChange}
                                    placeholder="(123) 456-7890"
                                    maxLength={14}
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.alternateContact && <span className="address-error-text">{errors.alternateContact}</span>}
                        </div>

                        {/* House No */}
                        <div className="address-form-group">
                            <label htmlFor="houseNo">
                                House No. / Building Name <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.houseNo ? 'error' : ''}`}>
                                <FiHome className="address-input-icon" />
                                <input
                                    type="text"
                                    id="houseNo"
                                    name="houseNo"
                                    value={formData.houseNo}
                                    onChange={handleInputChange}
                                    placeholder="E.g., 123, Building A"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.houseNo && <span className="address-error-text">{errors.houseNo}</span>}
                        </div>

                        {/* Street */}
                        <div className="address-form-group">
                            <label htmlFor="street">
                                Street / Area / Locality <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.street ? 'error' : ''}`}>
                                <FiMap className="address-input-icon" />
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="E.g., MG Road, Sector 5"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.street && <span className="address-error-text">{errors.street}</span>}
                        </div>

                        {/* Landmark */}
                        <div className="address-form-group full-width">
                            <label htmlFor="landmark">Landmark</label>
                            <div className="address-input-wrapper">
                                <FiNavigation className="address-input-icon" />
                                <input
                                    type="text"
                                    id="landmark"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleInputChange}
                                    placeholder="E.g., Near City Mall"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>

                        {/* City */}
                        <div className="address-form-group">
                            <label htmlFor="city">
                                City <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.city ? 'error' : ''}`}>
                                <FiMapPin className="address-input-icon" />
                                <input
                                    type="text"
                                    id="city"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter city name"
                                    disabled={isSubmitting}
                                />
                            </div>
                            {errors.city && <span className="address-error-text">{errors.city}</span>}
                        </div>

                        {/* State */}
                        <div className="address-form-group">
                            <label htmlFor="state">
                                State / Province <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.state ? 'error' : ''}`}>
                                <FiMap className="address-input-icon" />
                                {formData.country === 'India' ? (
                                    <select
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        disabled={isSubmitting}
                                        className="address-select"
                                    >
                                        <option value="">Select State</option>
                                        {indianStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter state/province"
                                        disabled={isSubmitting}
                                    />
                                )}
                            </div>
                            {errors.state && <span className="address-error-text">{errors.state}</span>}
                        </div>

                        {/* PIN Code */}
                        <div className="address-form-group">
                            <label htmlFor="pinCode">
                                PIN / ZIP Code <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.pinCode ? 'error' : ''}`}>
                                <FiMapPin className="address-input-icon" />
                                <input
                                    type="text"
                                    id="pinCode"
                                    name="pinCode"
                                    value={formData.pinCode}
                                    onChange={handleInputChange}
                                    placeholder={formData.country === 'India' ? '123456' : 'Enter PIN/ZIP'}
                                    disabled={isSubmitting}
                                    maxLength={10}
                                />
                            </div>
                            {errors.pinCode && <span className="address-error-text">{errors.pinCode}</span>}
                        </div>

                        {/* Country */}
                        <div className="address-form-group">
                            <label htmlFor="country">
                                Country <span className="required">*</span>
                            </label>
                            <div className={`address-input-wrapper ${errors.country ? 'error' : ''}`}>
                                <FiMapPin className="address-input-icon" />
                                <select
                                    id="country"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    className="address-select"
                                >
                                    {countries.map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>
                            {errors.country && <span className="address-error-text">{errors.country}</span>}
                        </div>
                    </div>

                    {/* Address Type */}
                    <div className="address-type-section">
                        <label className="address-section-label">Address Type</label>
                        <div className="address-type-buttons">
                            <button
                                type="button"
                                className={`address-type-btn ${formData.addressType === 'Home' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, addressType: 'Home' })}
                                disabled={isSubmitting}
                            >
                                <FiHome /> Home
                            </button>
                            <button
                                type="button"
                                className={`address-type-btn ${formData.addressType === 'Office' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, addressType: 'Office' })}
                                disabled={isSubmitting}
                            >
                                <FiBriefcase /> Office
                            </button>
                            <button
                                type="button"
                                className={`address-type-btn ${formData.addressType === 'Other' ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, addressType: 'Other' })}
                                disabled={isSubmitting}
                            >
                                <FiMapPin /> Other
                            </button>
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="address-checkbox-section">
                        <label className="address-checkbox-label">
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Make this my default address</span>
                        </label>

                        <label className="address-checkbox-label">
                            <input
                                type="checkbox"
                                name="saveForFuture"
                                checked={formData.saveForFuture}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                            <span className="checkbox-custom"></span>
                            <span className="checkbox-text">Save this address for future orders</span>
                        </label>
                    </div>

                    {/* Action buttons */}
                    <div className="address-modal-actions">
                        <button
                            type="button"
                            className="address-btn-cancel"
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="address-btn-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="address-spinner"></span>
                                    Saving...
                                </>
                            ) : (
                                'Save Address'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAddressModal;
