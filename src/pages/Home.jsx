import React, { useEffect, useState, useMemo, useRef, lazy, Suspense } from "react";
import "../css/Home.css";
import "../css/ShopByCategory.css";
import HeroCarousel from "../components/HeroCarousel";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import SEO from "../components/SEO";

// ✅ Lazy load PopularProducts (below-the-fold, not needed for initial render)
const PopularProducts = lazy(() => import("../components/PopularProducts"));

// ✅ Simple in-memory cache to avoid re-fetching on navigation back
let _categoriesCache = null;

const Home = () => {
  const [categories, setCategories] = useState(_categoriesCache || []);
  const [loading, setLoading] = useState(!_categoriesCache);
  const categoryScrollRef = useRef(null);

  useEffect(() => {
    // If we already have cached categories, skip the fetch
    if (_categoriesCache) {
      setCategories(_categoriesCache);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        // ✅ Use native fetch with caching instead of axios
        const response = await fetch(
          `${import.meta.env.VITE_API_KEY}/category/get`,
          {
            signal: controller.signal,
            // ✅ Leverage browser HTTP cache (server sends Cache-Control: public, max-age=300)
            cache: "default",
            headers: { Accept: "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        _categoriesCache = data; // store in module-level cache
        setCategories(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error fetching categories:", error);
          setCategories([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => controller.abort();
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
            width="80"
            height="80"
          />
        </div>
        <p className="sbc-name">{cat.name}</p>
      </div>
    ));
  }, [categories]);

  const scrollCategory = (direction) => {
    if (!categoryScrollRef.current) return;
    const container = categoryScrollRef.current;
    const firstCard = container.querySelector(".sbc-card");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 45;
    const scrollAmount = cardWidth + gap;

    if (direction === "left") {
      container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading && (!categories || categories.length === 0)) {
    return (
      <div id="Home">
        <SEO
          title="Home"
          description="ShopCo - Your one-stop shop for premium electronics, smart gadgets, and home appliances at the best prices."
          keywords="ShopCo, electronics, gadgets, smart home, mobile phones, headphones"
          url="https://shopco.site/"
        />
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            color: "#666",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div id="Home">
      <SEO
        title="Home"
        description="ShopCo - Your one-stop shop for premium electronics, smart gadgets, and home appliances at the best prices."
        keywords="ShopCo, electronics, gadgets, smart home, mobile phones, headphones"
        url="https://shopco.site/"
      />
      {/* <h1 className="visually-hidden">
        ShopCo - Premium Electronics, Smart Gadgets &amp; Home Appliances
      </h1> */}

      {/* Category Strip */}
      <div className="home-category">
        <div className="category-wrapper">
          <button
            className="sbc-arrow sbc-arrow-left"
            onClick={() => scrollCategory("left")}
            aria-label="Scroll categories left"
          >
            <FiChevronLeft />
          </button>
          <div className="sbc-container" ref={categoryScrollRef}>
            {loading
              ? Array.from({ length: 8 }).map((_, index) => (
                <div className="sbc-card skeleton" key={index}>
                  <div className="sbc-image-wrapper"></div>
                  <div className="sbc-name"></div>
                </div>
              ))
              : categoryItems}
          </div>
          <button
            className="sbc-arrow sbc-arrow-right"
            onClick={() => scrollCategory("right")}
            aria-label="Scroll categories right"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Hero Carousel - above the fold, load eagerly */}
      <HeroCarousel />

      {/* ✅ Lazy-loaded - below the fold, only loads when needed */}
      <Suspense fallback={<div style={{ textAlign: "center", padding: "40px", color: "#888" }}>Loading Products...</div>}>
        <PopularProducts />
      </Suspense>
    </div>
  );
};

export default React.memo(Home);
