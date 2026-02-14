import React from 'react';
import '../css/Footer.css';
import EnquiryForm from './EnquiryForm';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Company Info Section */}
                <div className="footer-section">
                    <h3>Shop.co</h3>
                    <p>Your one-stop shop for premium electronics, smart gadgets, and home appliances.</p>
                    <div className="social-links" style={{ marginTop: '20px' }}>
                        {/* Find icons if needed, or placeholders */}
                        <p>© {new Date().getFullYear()} Shop.co. All rights reserved.</p>
                    </div>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About Us</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>

                {/* Enquiry Form Section */}
                <div className="footer-section">
                    <EnquiryForm />
                </div>
            </div>
        </footer>
    );
};

export default Footer;
