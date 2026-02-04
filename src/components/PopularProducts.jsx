import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PopularProducts.css';
import { FiHeart, FiEye, FiBarChart2, FiShoppingCart, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';

const PopularProducts = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ELECTRONICS');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_KEY}/popularProducts`);
                if (response.data.success) {
                    setProducts(response.data.data);
                    const initialFiltered = response.data.data.filter(p =>
                        p.category.toUpperCase() === 'ELECTRONICS'
                    );
                    setFilteredProducts(initialFiltered);
                }
            } catch (error) {
                console.error("Failed to fetch popular products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const filtered = products.filter(p =>
            p.category.toUpperCase() === tab.toUpperCase()
        );
        setFilteredProducts(filtered);
    };
   
    const calculateTimeLeft = (endTime) => {
        const difference = +new Date(endTime) - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
                min: Math.floor((difference / 1000 / 60) % 60),
                sec: Math.floor((difference / 1000) % 60)
            };
        }
        return null;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading Popular Products...</div>;
    if (!products.length) return null;

    return (
        <div className="popular-products-section">
            <div className="pp-header">
                <h2>Popular Products</h2>
                <div className="pp-tabs">
                    {['ELECTRONICS', 'GADGETS', 'SMART DEVICES'].map(tab => (
                        <button
                            key={tab}
                            className={`pp-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="pp-grid">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.productId || product._id} product={product} calculateTimeLeft={calculateTimeLeft} />
                ))}
            </div>
            {!loading && filteredProducts.length === 0 && (
                <div className="pp-empty">No products found for this category.</div>
            )}
        </div>
    );
};

const ProductCard = ({ product, calculateTimeLeft }) => {
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        if (product.deal?.isDealActive && product.deal?.dealEndTime) {
            const timer = setInterval(() => {
                setTimeLeft(calculateTimeLeft(product.deal.dealEndTime));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [product.deal, calculateTimeLeft]);

    let imageUrl = product.images?.[0] || 'https://placehold.co/200?text=No+Image';
    if (imageUrl.startsWith('/uploads')) {
        imageUrl = `${import.meta.env.VITE_API_KEY}${imageUrl}`;
    }

    return (
        <div className="pp-card">
            {product.badge?.type && (
                <div className={`pp-badge ${product.badge.type.toLowerCase()}`}>
                    {product.badge.type === 'SALE' && product.discountPercentage ? `-${product.discountPercentage}%` : product.badge.type}
                </div>
            )}

            {/* <FiHeart className="pp-wishlist-icon" /> */}

            <div className="pp-image-container">
                <img src={imageUrl} alt={product.name} />

                <div className="pp-action-bar">
                    <div className="pp-action-btn" title="Compare"><FiHeart /></div>
                    <div className="pp-action-btn" title="Quick View"><FiEye /></div>
                    <div className="pp-action-btn" title="Add to Cart"><FiShoppingCart /></div>
                </div>

                {product.deal?.isDealActive && timeLeft && (
                    <div className="pp-countdown">
                        <div className="pp-countdown-item">
                            <span className="pp-countdown-val">{timeLeft.days}</span>
                            <span className="pp-countdown-label">DAYS</span>
                        </div>
                        <div className="pp-countdown-item">
                            <span className="pp-countdown-val">{timeLeft.hrs}</span>
                            <span className="pp-countdown-label">HRS</span>
                        </div>
                        <div className="pp-countdown-item">
                            <span className="pp-countdown-val">{timeLeft.min}</span>
                            <span className="pp-countdown-label">MIN</span>
                        </div>
                        <div className="pp-countdown-item">
                            <span className="pp-countdown-val">{timeLeft.sec}</span>
                            <span className="pp-countdown-label">SEC</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="pp-details">
                <div className="pp-brand">{product.brand}</div>
                <div className="pp-title" title={product.name}>{product.name}</div>

                <div className="pp-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} style={{ color: star <= Math.round(product.rating) ? '#F59E0B' : '#E5E7EB' }}>
                            <FaStar />
                        </span>
                    ))}
                    <span className="pp-rating-count">({product.reviewCount})</span>
                </div>

                <div className="pp-price-box">
                    <span className="pp-price">₹{product.price.toFixed(2)}</span>
                    {product.mrp > product.price && (
                        <span className="pp-mrp">₹{product.mrp.toFixed(2)}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopularProducts;