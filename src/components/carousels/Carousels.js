import React from "react";
import Carousel from "react-bootstrap/Carousel";
import "./Carousels.css";

export default function Carousels() {
  return (
    <div className="carousel-container">
      <Carousel fade>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={"/images/math1.png"}
            alt="First slide"
          />
          <Carousel.Caption>
            <h3 className="carousel-title">Welcome to Math Explorers!</h3>
            <p className="carousel-text">
              Join us on a fun-filled journey through the world of numbers and
              shapes, where every math problem is an adventure!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={"/images/math2.png"}
            alt="Second slide"
          />
          <Carousel.Caption>
          <h3 className="carousel-title">Math Magic Kingdom!</h3>
          <p className="carousel-text">
              Step into a magical world where numbers are your friends and every
              math puzzle is a spell waiting to be solved!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={"/images/math3.png"}
            alt="Third slide"
          />
          <Carousel.Caption>
          <h3 className="carousel-title">Shapes and Numbers Safari!</h3>
          <p className="carousel-text">
              Embark on an exciting safari adventure where we discover the
              secrets of shapes and have fun with numbers in the wild!
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
