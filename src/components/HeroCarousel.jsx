import React, { useState, useCallback } from 'react';
import '../css/HeroCarousel.css';
import samsungTvImage from '../assets/carosel/samsung-tv.webp';
import samsungS25Image from '../assets/carosel/samsung-s25.webp';
import vivoImage from '../assets/carosel/Vivo.webp';
import hpLaptopImage from '../assets/carosel/HP_laptop.webp';

// ✅ Moved outside component — prevents recreation on every render
const carouselSlides = [
    {
        id: 1,
        image: samsungTvImage,
        title: "Samsung QLED 4K TV",
        subtitle: "Experience Cinematic Brilliance",
        description: "Immerse yourself in stunning 4K resolution with Quantum Dot technology",
        cta: "Shop Now",
    },
    {
        id: 2,
        image: samsungS25Image,
        title: "Samsung Galaxy S25",
        subtitle: "Next-Gen Performance",
        description: "Unleash the power of AI with cutting-edge technology",
        cta: "Explore",
    },
    {
        id: 3,
        image: vivoImage,
        title: "Vivo Premium Series",
        subtitle: "Photography Redefined",
        description: "Capture life's moments with professional-grade camera systems",
        cta: "Discover",
    },
    {
        id: 4,
        image: hpLaptopImage,
        title: "HP Elite Laptop",
        subtitle: "Power Meets Portability",
        description: "Ultimate performance for professionals on the go",
        cta: "Learn More",
    }
];

const HeroCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const nextSlide = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
            setTimeout(() => setIsTransitioning(false), 800);
        }
    }, [isTransitioning]);

    const prevSlide = useCallback(() => {
        if (!isTransitioning) {
            setIsTransitioning(true);
            setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
            setTimeout(() => setIsTransitioning(false), 800);
        }
    }, [isTransitioning]);

    const goToSlide = (index) => {
        if (!isTransitioning && index !== currentSlide) {
            setIsTransitioning(true);
            setCurrentSlide(index);
            setTimeout(() => setIsTransitioning(false), 800);
        }
    };

    return (
        <div className="hero-carousel">
            <div className="carousel-container">
                <div className="carousel-slides">
                    {carouselSlides.map((slide, index) => (
                        <div
                            key={slide.id}
                            className={`carousel-slide ${index === currentSlide ? 'active' : ''} ${index === (currentSlide - 1 + carouselSlides.length) % carouselSlides.length
                                ? 'prev'
                                : ''
                                } ${index === (currentSlide + 1) % carouselSlides.length ? 'next' : ''}`}
                            style={{ background: slide.bgGradient }}
                        >
                            <div className="animated-bg">
                                <div className="shape shape-1"></div>
                                <div className="shape shape-2"></div>
                                <div className="shape shape-3"></div>
                            </div>

                            <div className="slide-content">
                                <div className="content-text">
                                    <div className="text-wrapper">
                                        <span className="slide-subtitle">{slide.subtitle}</span>
                                        <h2 className="slide-title">{slide.title}</h2>
                                        <p className="slide-description">{slide.description}</p>
                                        <button className="cta-button">
                                            {slide.cta}
                                            <span className="button-arrow">
                                                <i className="bi bi-arrow-right"></i>
                                            </span>
                                        </button>
                                    </div>
                                </div>

                                <div className="content-image">
                                    <div className="image-wrapper">
                                        <div className="image-glow"></div>
                                        {/* ✅ First image: eager load with high priority (LCP element) */}
                                        {/* ✅ Other images: lazy load to save bandwidth */}
                                        <img
                                            src={slide.image}
                                            alt={slide.title}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            fetchpriority={index === 0 ? 'high' : 'low'}
                                            decoding={index === 0 ? 'sync' : 'async'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="carousel-nav prev-btn"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                <button
                    className="carousel-nav next-btn"
                    onClick={nextSlide}
                    aria-label="Next slide"
                >
                    <i className="bi bi-chevron-right"></i>
                </button>

                <div className="carousel-pagination">
                    {carouselSlides.map((_, index) => (
                        <button
                            key={index}
                            className={`pagination-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => goToSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            <span
                                className="dot-progress"
                                onAnimationEnd={nextSlide}
                            ></span>
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HeroCarousel;
