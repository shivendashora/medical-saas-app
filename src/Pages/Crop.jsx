import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageAnnotator from '../Components/ImageAnnotator'; // Assuming you have ImageAnnotator as a separate component

gsap.registerPlugin(ScrollTrigger);

const Crop = ({ darkMode }) => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnnotating, setIsAnnotating] = useState(false);

  const headingRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // GSAP animations for heading and button
    gsap.fromTo(
      headingRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%', // Animation starts when the heading is 80% into the viewport
        },
      }
    );

    gsap.fromTo(
      buttonRef.current,
      { scale: 0.8, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1,
        ease: 'elastic.out(1, 0.75)',
        scrollTrigger: {
          trigger: buttonRef.current,
          start: 'top 80%', // Animation starts when the button is 80% into the viewport
        },
      }
    );
  }, []);

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newImages = [];
    for (let i = 0; i < files.length; i++) {
      newImages.push(URL.createObjectURL(files[i]));
    }
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    if (images.length > 0) {
      setSelectedImage(images[0]);
      setCurrentImageIndex(0);
    }
  };

  const handleBack = () => {
    setSelectedImage(null);
  };

  const changeImage = (direction) => {
    const newIndex =
      direction === 'next'
        ? (currentImageIndex + 1) % images.length
        : (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]); // Update the selected image based on the new index
  };

  if (isAnnotating && selectedImage) {
    return (
      <ImageAnnotator
        image={selectedImage}
        onBack={() => setIsAnnotating(false)}
        onSave={({ image, annotations }) => {
          console.log('Annotations:', annotations);
          setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages[currentImageIndex] = image;
            return updatedImages;
          });
          setIsAnnotating(false);
        }}
      />
    );
  }

  if (selectedImage) {
    return (
      <div className={`expanded-view-container ${darkMode ? 'dark-mode' : ''}`}>
        <div className="slider-container">
          <button
            onClick={() => changeImage('prev')}
            className="slider-button prev-button"
          >
            &#60;
          </button>
          <div className="expanded-image-container">
            <img src={selectedImage} alt="Selected" className="expanded-image" />
          </div>
          <button
            onClick={() => changeImage('next')}
            className="slider-button next-button"
          >
            &#62;
          </button>
        </div>
        <div className="action-buttons">
          <button
            onClick={() => {
              setIsAnnotating(true);
              setSelectedImage(images[currentImageIndex]);
            }}
            className="annotate-button"
          >
            Annotate
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`crop-container ${darkMode ? 'dark-mode' : ''}`}>
      <h1 className="heading" ref={headingRef}>
        Upload Images to make Annotations,Multiple images can be uploaded
      </h1>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <button className="upload-button" ref={buttonRef} onClick={handleButtonClick}>
        Upload Images
      </button>

      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-container">
            <img
              src={image}
              alt={`Uploaded ${index}`}
              className="uploaded-image"
            />
            <div className="hover-overlay" onClick={() => handleRemoveImage(index)}>
              <span className="remove-icon">&times;</span>
            </div>
          </div>
        ))}
      </div>

      {images.length > 0 && (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleContinue}
            className="continue-button-fixed"
            style={{
              backgroundColor: 'black',
              color: 'white',
              border: 'none',
              transition: 'background-color 1s, color 1s, border 1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = 'black';
              e.currentTarget.style.border = '1px solid black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.border = 'none';
            }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default Crop;
