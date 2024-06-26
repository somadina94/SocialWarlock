import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../../images/joker1.jpg";
import img2 from "../../images/joker2.jpg";
import img3 from "../../images/joker3.jpg";
import img4 from "../../images/joker4.jpg";
import img5 from "../../images/joker5.jpg";
import img6 from "../../images/joker6.jpg";
import img7 from "../../images/joker7.jpg";

function Carousels() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      className="carou carou-desktop mb-5"
      controls={false}
      indicators={false}
    >
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img2}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img3}
          alt="Third slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img4}
          alt="Fourth slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img5}
          alt="Fifth slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img6}
          alt="Sixth slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img7}
          alt="Sixth slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default Carousels;
