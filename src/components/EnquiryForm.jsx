import React, { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import axios from 'axios';
import '../css/Footer.css'; // Assuming styles are here or separate file

const EnquiryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [turnstileToken, setTurnstileToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!turnstileToken) {
            setStatus({ type: 'error', message: 'Please complete the CAPTCHA verification.' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_KEY}/api/enquiry`, {
                ...formData,
                turnstileToken
            });

            setStatus({ type: 'success', message: response.data.message });
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTurnstileToken(''); // Clear token
            // Note: Typically Turnstile component might need to be reset manually if needed, 
            // but usually creating a new token requires user interaction or re-render.

        } catch (error) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Something went wrong. Please try again.'
            });
            console.error("Enquiry submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="enquiry-form-container">
            <h3>Contact Us</h3>
            {status.message && (
                <div className={`form-message ${status.type}`}>
                    {status.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="enquiry-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name *"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address *"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                        title="Please enter a valid email address"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={loading}
                        pattern="^\+?[\d\s-]{10,15}$"
                        title="Phone number should differ 10 to 15 digits"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="subject"
                        placeholder="Subject *"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        minLength={5}
                    />
                </div>
                <div className="form-group">
                    <textarea
                        name="message"
                        placeholder="Your Message (min 20 chars) *"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="4"
                        disabled={loading}
                        minLength={20}
                    />
                </div>

                <div className="turnstile-container" style={{ minHeight: '65px' }}>
                    <Turnstile
                        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACcdJoczQLW-Q_hE"}
                        onSuccess={(token) => setTurnstileToken(token)}
                        onError={() => setStatus({ type: 'error', message: 'CAPTCHA error. Please refresh.' })}
                        onExpire={() => setTurnstileToken('')}
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading || !turnstileToken}
                >
                    {loading ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </div>
    );
};

export default EnquiryForm;
