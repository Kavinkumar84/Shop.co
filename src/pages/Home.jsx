import React from "react";
import "../css/Home.css";
import HeroCarousel from "../components/HeroCarousel";

import Mobile from "../assets/mobile.png";
import Laptop from "../assets/laptop.png";
import Electronics from "../assets/Electronics.png";
import Tv from "../assets/Tv.png";
import Appliances from "../assets/appliances.png";
import Audio from "../assets/audio.png";
import Wearables from "../assets/wearables.webp";

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

      <HeroCarousel />
    </div>
  );
};

export default Home;
