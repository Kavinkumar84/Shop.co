import React, { useEffect, useState } from "react";
import "../css/Home.css";
import "../css/ShopByCategory.css";
import HeroCarousel from "../components/HeroCarousel";
import axios from "axios";
import PopularProducts from "../components/PopularProducts";

const Home = () => {
  const [categories, setCategories] = useState([]);

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
      }
    };

    fetchCategories();
  }, []);

  return (
    <div id="Home">
      <div className="home-category">
        <div className="category-wrapper">
          <div className="sbc-container">
            {Array.isArray(categories) &&
              categories.map((cat) => (
                <div className="sbc-card" key={cat._id}>
                  <div className="sbc-image-wrapper">
                    <img
                      src={
                        cat.image?.path?.startsWith("http")
                          ? cat.image.path
                          : `${import.meta.env.VITE_API_KEY}/${cat.image?.path?.replace(/^\/+/, "")}`
                      }
                      alt={cat.image?.alt || cat.name}
                    />
                  </div>
                  <p className="sbc-name">{cat.name}</p>
                </div>
              ))}
          </div>
        </div>
      </div>

      <HeroCarousel />
      <PopularProducts />
    </div>
  );
};

export default Home;
