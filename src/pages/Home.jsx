import React from "react";
import "../css/Home.css";
import { Carousel } from "react-bootstrap";

import Banner1 from "../assets/banner1.png";
import Mobile from "../assets/mobile.png";
import Laptop from "../assets/laptop.png";
import Electronics from "../assets/Electronics.png";
import Tv from "../assets/Tv.png";
import Appliances from "../assets/appliances.png";
import Audio from "../assets/audio.png";
import Wearables from "../assets/wearables.webp";
import appleHeadphone from "../assets/ban1.webp";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { MdDiscount } from "react-icons/md";

const Home = () => {
  const categories = [
    { img: Mobile, title: "Mobiles & Smartphones" },
    { img: Laptop, title: "Laptops" },
    { img: Electronics, title: "Electronics" },
    { img: Tv, title: "Smart TVs" },
    { img: Appliances, title: "Home Appliances" },
    { img: Audio, title: "Audio Devices" },
    { img: Wearables, title: "Wearables" },
  ];

  return (
    <div id="Home">
      <div className="home-category">
        {/* CATEGORY SECTION */}
        <div className="category-drop">
          {categories.map((item, i) => (
            <div className="category-box" key={i}>
              <div className="category-box-top">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="category-box-bottom">{item.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel">
        <Carousel fade>
          <Carousel.Item>
            <div className="banner-container">
              <div className="banner-content">
                <div className="decorative-circle"></div>
                <div className="decorative-circle-2"></div>

                <div className="banner-left">
                  <div className="new-arrival-badge">
                    <div className="badge-dot"></div>
                    <span className="badge-text">New Arrival</span>
                  </div>

                  <h1 className="banner-title">
                    Feel Every
                    <br />
                    Beat
                  </h1>

                  <p className="banner-description">
                    Immerse yourself in studio-quality sound. Features
                    industry-leading Noise Cancellation, Deep Bass, and all-day
                    comfort.
                  </p>

                  <div className="feature-tags">
                    <div className="feature-tag">
                      <svg
                        className="feature-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                      </svg>
                      Deep Bass
                    </div>
                    <div className="feature-tag">
                      <svg
                        className="feature-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Active Noise Cancellation
                    </div>
                    <div className="feature-tag">
                      <svg
                        className="feature-icon"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      40H Playtime
                    </div>
                  </div>

                  <div className="banner-buttons">
                    <button className="btn-primary">
                      Shop Headphones
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </button>
                   
                  </div>
                </div>

                <div className="banner-right">
                  <div className="headphone-card">
                    <div className="discount-badge">
                      <MdDiscount  style={{color : "#3b82f6",fontSize:"20px"}}/>
                      <div className="">
                        <div className="discount-label">Limited Time</div>
                        <div className="discount-value">Flat 30% OFF</div>
                      </div>
                    </div>

                    <img
                      src={appleHeadphone}
                      alt="Premium Headphones"
                      className="headphone-image"
                    />

                    <div className="bt-badge">
                      <svg
                        className="bt-icon"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.5 2.5v19l6-5.5-6-5.5v-8zm1 0v8l6 5.5-6 5.5z" />
                      </svg>
                      <span className="bt-text">BT 5.0</span>
                    </div>
                  </div>
                </div>

                <button className="arrow-left">
                  <BiChevronLeft size={20} color="#ffffff" />
                </button>
                <button className="arrow-right">
                  <BiChevronRight size={20} color="#ffffff" />
                </button>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
};

export default Home;
