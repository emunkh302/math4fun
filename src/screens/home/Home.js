import React from "react";
import NavUser from "../../components/nav-user/NavUser";
import GradeChoose from "../../components/grade-choose/GradeChoose";
import InfoNav from "../../components/info-nav/InfoNav";
import Testimonial from "../../components/testimonial/Testimonial";
import Carousels from "../../components/carousels/Carousels";
import AccordionInfo from "../../components/accordion-info/AccordionInfo";
import "./Home.css";
import Footer from "../../components/footer/Footer";

export default function Home() {
  return (
    <div className="home-container">
      <NavUser />
      <InfoNav />
      <Carousels />

      <div className="inner-container">
        <AccordionInfo />
        <br />
        <GradeChoose />
        <Testimonial />
      </div>

      <Footer />
    </div>
  );
}
