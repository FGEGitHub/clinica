import React, { useState, useEffect } from "react";
import "./ZoomCarousel.css";

const ZoomCarousel = ({ images = [] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="zoom-container">
      {images.map((img, i) => (
        <div
          key={i}
          className={`zoom-slide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}
    </div>
  );
};

export default ZoomCarousel;