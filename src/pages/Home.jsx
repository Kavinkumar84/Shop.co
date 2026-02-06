import React, { useEffect, useState, useMemo } from "react";
import "../css/Home.css";
import "../css/ShopByCategory.css";
import HeroCarousel from "../components/HeroCarousel";
import axios from "axios";
import PopularProducts from "../components/PopularProducts";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div id="Home">
      <div className="home-category">
        <div className="category-wrapper">
          <div className="sbc-container">
            {loading ? (
              // Skeleton Loader
              Array.from({ length: 6 }).map((_, index) => (
                <div className="skeleton-card" key={index}>
                  <div className="skeleton-circle"></div>
                  <div className="skeleton-text"></div>
                </div>
              ))
            ) : (
              categoryItems
            )}
          </div>
        </div>
      </div>

      <HeroCarousel />
      <PopularProducts />
    </div>
  );
};

export default React.memo(Home);
