import React, { useEffect, useState, useMemo, useRef } from "react";
import "../css/Home.css";
import "../css/ShopByCategory.css";
import HeroCarousel from "../components/HeroCarousel";
import axios from "axios";
import PopularProducts from "../components/PopularProducts";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_KEY}/category/get`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const categoryItems = useMemo(() => {
    if (!Array.isArray(categories)) return null;

    return categories.map((cat) => (
      <div className="sbc-card" key={cat._id}>
        <div className="sbc-image-wrapper">
          <img
            src={
              cat.image?.path?.startsWith("http")
                ? cat.image.path
                : `${import.meta.env.VITE_API_KEY}/${cat.image?.path?.replace(/^\/+/, "")}`
            }
            alt={cat.image?.alt || cat.name}
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="sbc-name">{cat.name}</p>
      </div>
    ));
  }, [categories]);

  const scrollCategory = (direction) => {
    if (!categoryScrollRef.current) return;
    const container = categoryScrollRef.current;
    const firstCard = container.querySelector('.sbc-card');
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = 45; // gap between cards
    const scrollAmount = cardWidth + gap;
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="Home">
      <h1 className="seo-title" style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: '0' }}>
        ShopCo - Premium Electronics, Smart Gadgets & Home Appliances
      </h1>
      <div className="home-category">
        <div className="category-wrapper">
          <button 
            className="sbc-arrow sbc-arrow-left" 
            onClick={() => scrollCategory('left')}
            aria-label="Scroll categories left"
          >
            <FiChevronLeft />
          </button>
          <div className="sbc-container" ref={categoryScrollRef}>
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, index) => (
                <div className="sbc-card skeleton" key={index}>
                  <div className="sbc-image-wrapper"></div>
                  <div className="sbc-name"></div>
                </div>
              ))
            ) : (
              categoryItems
            )}
          </div>
          <button 
            className="sbc-arrow sbc-arrow-right" 
            onClick={() => scrollCategory('right')}
            aria-label="Scroll categories right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <HeroCarousel />
      <PopularProducts />
    </div>
  );
};

export default React.memo(Home);
