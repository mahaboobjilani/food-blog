import { useState } from "react";
import { useNavigate } from "react-router-dom";
import foodRecipe from "../assets/vegetarian/foodRecipe.png";
import InputForm from "../components/InputForm";
import Model from "../components/Model";
import '../styles/Home.css';

import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import divya from '../assets/divya.jpeg';
import mehra from '../assets/mehra.jpeg';
import ravi from '../assets/ravi.jpeg';
import sneha from '../assets/sneha.jpeg';

import darkfantacy from '../assets/desserts/darkfantacy.jpeg';
import pannertikka from '../assets/pannertikka.jpeg';
import pizza from '../assets/pizza.jpeg';
const Home = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const addRecipe = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/addRecipe");
    } else {
      setIsOpen(true);
    }
  };

 const testimonials = [
  {
    title: "Spicy Paneer Tikka",
    details: "A delicious Indian appetizer with paneer.",
    image: pannertikka,
  },
  {
    title: "Chocolate Fudge Brownie",
    details: "Rich gooey chocolate brownies.",
    image: darkfantacy,
  },
  {
    title: "Classic Margherita Pizza",
    details: "Soft pizza with fresh tomato sauce.",
    image: pizza,
  },
];

  return (
    <>
      {/* Hero Section */}
       <section className="home">
        <div className="left">
          <h1>Food Recipe</h1>
          <h5>
             Explore, share, and enjoy recipes from around the world. Create your own recipe collection and inspire others!
          </h5>
          <button onClick={addRecipe}>Share your recipe</button>
        </div>
        <div className="right">
          <img
            src={foodRecipe}
            width="320px"
            height="300px"
            alt="Food"
          />
        </div>
      </section>

      <div className="bg">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 360">
          <path
            fill="#d4f6e8"
            d="M0,32L40,32C80,32,160,32,240,58.7C320,85,400,139,480,149.3C560,160,640,128,720,101.3C800,75,880,53,960,80C1040,107,1120,181,1200,213.3C1280,245,1360,235,1400,229.3L1440,224L1440,320L0,320Z"
          ></path>
        </svg>
      </div>
      
 <div className="about">
      {/* Intro Section */}
    

      {/* Mission Section */}
      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
         At <strong>Recipe Hub</strong>, we strive to make cooking simple, fun, and accessible for everyone. From quick weeknight meals to gourmet creations, we provide reliable, tested recipes and helpful tips so you can cook with confidence. Whether you’re a beginner or an experienced chef, Recipe Hub ensures you always have the inspiration and guidance to create delicious meals at home.
        </p>
      </section>

      {/* Core Values */}
   <section className="home-features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Easy Sharing</h3>
            <p>Share your recipes effortlessly and inspire others with your culinary skills.</p>
          </div>
          <div className="feature-card">
            <h3>Discover New Recipes</h3>
            <p>Explore a wide variety of recipes from global cuisines and unique creations.</p>
          </div>
          <div className="feature-card">
            <h3>Personal Collection</h3>
            <p>Save your favorite recipes in one place and access them anytime.</p>
          </div>
        </div>
      </section>

 <section className="testimonials">
  <h2 className="testimonials-title">Our Team</h2>
  <div className="testimonials-wrapper">
    <div className="testimonial">
      <img src={mehra} alt="Akshay Mehra" className="testimonial-avatar" />
      <h4 className="testimonial-name">Akshay Mehra</h4>
      <p className="testimonial-text">
        "Working with this team has been an incredible experience. Everyone is so supportive and collaborative!"
      </p>
    </div>
    <div className="testimonial">
      <img src={divya} alt="Divya Singh" className="testimonial-avatar" />
      <h4 className="testimonial-name">Divya Singh</h4>
      <p className="testimonial-text">
        "The team's dedication and creativity make every project exciting. I'm proud to be a part of it!"
      </p>
    </div>
    <div className="testimonial">
      <img src={ravi} alt="Ravi Patel" className="testimonial-avatar" />
      <h4 className="testimonial-name">Ravi Patel</h4>
      <p className="testimonial-text">
        "Collaboration here is seamless. Everyone contributes their best, and the environment is very motivating."
      </p>
    </div>
    <div className="testimonial">
      <img src={sneha} alt="Sneha Reddy" className="testimonial-avatar" />
      <h4 className="testimonial-name">Sneha Reddy</h4>
      <p className="testimonial-text">
        "I appreciate the guidance and mentorship from the team. Learning and growing together has been amazing!"
      </p>
    </div>
  </div>
</section>


      {/* Team or Story */}
      <section className="about-section story">
        <h2>Our Journey</h2>
        <p>
          Started in 2024, QuickCart began with a small team of tech enthusiasts and retail experts
          who believed that online shopping in India could be much faster and more personal. Since then, we've grown into a trusted name serving thousands across the country.
        </p>
      </section>

    
      
    </div>
    

     
  <section className="testimonials-section">
        <h2>User Shrered Recipes</h2>
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={2}
          loop={true}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div className="testimonial-card">
                <img src={t.image} alt={t.title} />
                <h4>{t.title}</h4>
                <p>"{t.details}"</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>




{/* Contact Us Section */}
<section className="home-contact">
  <h2>Contact Us</h2>
  <div className="contact-grid">
    <div className="contact-card">
      <h4>Address</h4>
      <p>123 Culinary Street, Food City, FC 45678, India</p>
    </div>
    <div className="contact-card">
      <h4>Email</h4>
      <p>support@recipehub.com</p>
    </div>
    
    <div className="contact-card">
      <h4>Phone</h4>
      <p>+91 99881 12233</p>
    </div>
   <div className="contact-card">
      <h4>Insta Profile</h4>
      <p>recipehub_official</p>
    </div>
  </div>
</section>

      {/* Modal for login/signup */}
      {isOpen && (
        <Model onClose={() => setIsOpen(false)}>
          <InputForm setIsOpen={setIsOpen} />
        </Model>
      )}
    </>
  );
};

export default Home;
