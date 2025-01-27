import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import healthImage from '../assets/images.jpg';
import healthImage1 from '../assets/image2.jpg';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Home = ({ darkMode }) => {
  const navigate = useNavigate();

  // Ensure the scroll position is reset to the top before animations
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Set initial styles for revealUp elements
    gsap.set('.revealUp', { autoAlpha: 0, y: 100 });

    // REVEAL Animation for All Elements with 'revealUp'
    gsap.utils.toArray('.revealUp').forEach((elem) => {
      ScrollTrigger.create({
        trigger: elem,
        start: 'top 80%',
        end: 'bottom 20%',
        markers: false, // Set markers to false for clean view
        onEnter: () => {
          gsap.to(elem, {
            duration: 1.25,
            y: 0,
            autoAlpha: 1,
            ease: 'back',
            overwrite: 'auto',
          });
        },
        onLeave: () => {
          gsap.to(elem, { autoAlpha: 0, overwrite: 'auto' });
        },
        onEnterBack: () => {
          gsap.to(elem, {
            duration: 1.25,
            y: 0,
            autoAlpha: 1,
            ease: 'back',
            overwrite: 'auto',
          });
        },
        onLeaveBack: () => {
          gsap.to(elem, { autoAlpha: 0, overwrite: 'auto' });
        },
      });
    });
  }, []);

  const handleGetStartedClick = () => {
    navigate('/crop'); // Redirect to crop-path
  };

  return (
    <div>
      <div className="open">
        <img src="{}" alt="" />
        <span className="Measure-x revealUp">Welcome to Measurex</span>
        <span className="Below-measurex revealUp">Solves the Problem with accuracy</span>
      </div>
      <div className="Home-start">
        <div className="health-image-div">
          <img
            src={healthImage}
            alt="Medical Image"
            className="health-image revealUp"
          />
          <img
            src={healthImage1}
            alt="Medical Image"
            className="health-image-2 revealUp"
          />
        </div>
        <div className="intro-text">
          <p className="intro revealUp" style={{ color: darkMode ? 'white' : 'black' }}>
            Lab technicians often face challenges with medical image analysis, including accurate annotation, precise measurements, geometric calculations, and identifying regions of interest. These tasks are crucial for diagnostics and treatment planning but are hindered by the lack of intuitive tools that support standard image formats like PNG. <b>Measure-X</b> bridges this gap, providing efficient, user-friendly solutions for seamless medical image processing.
          </p>
        </div>
      </div>
      <div className="home-middle">
        <div className="middle">
          <p className="Middle-text revealUp" style={{ color: darkMode ? 'white' : 'black' }}>
            Click on the button below to get Started with the process of annotating images
          </p>
          <button
            className={`get-started revealUp ${darkMode ? 'dark' : 'light'}`} // Conditional class for dark or light mode
            onClick={handleGetStartedClick}
            style={{
              backgroundColor: darkMode ? 'white' : 'black', // White background in dark mode, black in normal mode
              color: darkMode ? 'black' : 'white', // Black text in dark mode, white text in normal mode
              border: '1px solid',
              borderColor: darkMode ? 'white' : 'black', // White border in dark mode, black border in normal mode
              transition: 'all 0.3s ease', // Smooth transition for background color and text color on hover
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
