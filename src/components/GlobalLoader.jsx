import React from 'react';
import '../css/GlobalLoader.css';
import Logo from '../assets/logo.png';

const GlobalLoader = () => {
    return (
        <div className="global-loader-container">
            <div className="loader-content">
                <div className="spinner-ring"></div>
                <img src={Logo} alt="ShopCo Logo" className="loader-logo" />
            </div>
        </div>
    );
};

export default GlobalLoader;
