import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { BsPuzzleFill } from 'react-icons/bs';
import './Testimonial.css';

const mathQuotes = [
    "Pure mathematics is, in its way, the poetry of logical ideas. - Albert Einstein",
    "Mathematics is the music of reason. - James Joseph Sylvester",
    "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding. - William Paul Thurston",
    "The only way to learn mathematics is to do mathematics. - Paul Halmos",
    "An equation means nothing to me unless it expresses a thought of God. - Srinivasa Ramanujan",
    "Mathematics knows no races or geographic boundaries; for mathematics, the cultural world is one country. - David Hilbert",
    "In mathematics, the art of proposing a question must be held of higher value than solving it. - Georg Cantor",
    "The essence of mathematics lies in its freedom. - Georg Cantor",
    "Life is good for only two things, discovering mathematics and teaching mathematics. - Siméon Poisson",
    "Mathematics is the key and door to the sciences. - Galileo Galilei"
];


export default function Testimonial() {
    const [quote, setQuote] = useState(mathQuotes[0]); // Start with the first quote

    const changeQuote = () => {
        const randomIndex = Math.floor(Math.random() * mathQuotes.length);
        setQuote(mathQuotes[randomIndex]);
    };

    return (
        <Card body className="testimonial-card" onMouseEnter={changeQuote}>
            <BsPuzzleFill className="math-icon" />
            <p className="math-quote">{quote}</p>
        </Card>
    );
}
