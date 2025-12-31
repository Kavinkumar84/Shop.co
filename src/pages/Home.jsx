import React from "react";
import "../css/Home.css";

const Home = () => {
  const categories = [
    { img: "src/assets/mobile.png", title: "Mobiles & Smartphones" },
    { img: "src/assets/laptop.png", title: "Laptops" },
    { img: "src/assets/Ectronics.png", title: "Electronics" },
    { img: "src/assets/Tv.png", title: "Smart TVs" },
    { img: "src/assets/appliances.png", title: "Home Appliances" },
    { img: "src/assets/audio.png", title: "Audio Devices" },
    {
      img: "src/assets/wearables.webp",
      title: "Wearables",
      arrow: true,
    },
  ];

  return (
    <div id="Home">
      <div className="home-category">
        <div className="category-drop">
          {categories.map((item, i) => (
            <div className="category-box" key={i}>
              <div className="category-box-top">
                <img src={item.img} alt={item.title} />
              </div>

              <div className="category-box-bottom">
                {item.title}
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
