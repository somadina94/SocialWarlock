import React, { useState } from "react";
import Carousel from "react-bootstrap/Carousel";

import img1 from "../../images/joker00.jpg";
import img2 from "../../images/joker22.jpg";
import img3 from "../../images/joker33.jpg";
import img4 from "../../images/joker44.jpg";
import img5 from "../../images/joker55.jpg";
import img6 from "../../images/joker66.jpg";
import img7 from "../../images/joker77.jpg";
import img8 from "../../images/joker88.jpg";
import img9 from "../../images/joker99.jpg";

function CarouselMobile() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel
      activeIndex={index}
      onSelect={handleSelect}
      className="carou carou-mobile mb-5"
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
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img8}
          alt="Sixth slide"
        />
      </Carousel.Item>
      <Carousel.Item className="c-item">
        <img
          className="d-block min-vh-100 c-img"
          src={img9}
          alt="Sixth slide"
        />
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselMobile;
