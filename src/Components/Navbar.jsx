import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ darkMode }) => {
  return (
    <div>
      <div className="navbar" style={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
        <div className="home">
          <Link
            to="/"
            style={{
              color: darkMode ? 'white' : 'black',
              marginRight: '10px',
              textDecoration: 'none',
              padding: '10px 20px', // Added padding to stretch the link
              fontSize: '18px',
              fontWeight: '500',
              transition: 'background-color 1s ease, color 1s ease', // Added transition for background and text color
              borderRadius: '5px', // Rounded corners for the squared background
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? 'white' : 'black';
              e.target.style.color = darkMode ? 'black' : 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = darkMode ? 'white' : 'black';
            }}
          >
            Home
          </Link>

          <Link
            to="/crop"
            style={{
              color: darkMode ? 'white' : 'black',
              margin: '0 10px',
              textDecoration: 'none',
              padding: '10px 20px', // Added padding to stretch the link
              fontSize: '18px',
              fontWeight: '500',
              transition: 'background-color 1s ease, color 1s ease', // Added transition for background and text color
              borderRadius: '5px', // Rounded corners for the squared background
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = darkMode ? 'white' : 'black';
              e.target.style.color = darkMode ? 'black' : 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = darkMode ? 'white' : 'black';
            }}
          >
            Annotate
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
