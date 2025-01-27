import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Crop from './Pages/Crop';
import Home from './Pages/Home';
import { FaSun, FaMoon } from 'react-icons/fa';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  useEffect(() => {
    // Update the global styles for dark mode
    const html = document.documentElement;
    const body = document.body;

    if (darkMode) {
      html.style.backgroundColor = 'black';
      body.style.backgroundColor = 'black';
      html.style.color = 'white';
      body.style.color = 'white';
    } else {
      html.style.backgroundColor = 'white';
      body.style.backgroundColor = 'white';
      html.style.color = 'black';
      body.style.color = 'black';
    }
  }, [darkMode]); // Re-run whenever darkMode changes

  return (
    <div style={{ minHeight: '100vh' }}>
      <Router>
        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px',
            backgroundColor: darkMode ? 'black' : 'white',
            color: darkMode ? 'white' : 'black',
          }}
        >
          <div className="home">
            <Link
              to="/"
              className="Heading-home"
              style={{
                color: darkMode ? 'white' : 'black',
                marginRight: '20px',
                fontWeight: '300',
                fontSize: '24px',
                textDecoration: 'none',
              }}
            >
              MeasureX
            </Link>
          </div>
          <Navbar darkMode={darkMode} />
          <button
            onClick={toggleDarkMode}
            style={{
              backgroundColor: darkMode ? 'black' : 'transparent',
              color: darkMode ? 'white' : 'black',
              cursor: 'pointer',
              border: 'none', // Remove border
            }}
          >
            {darkMode ? <FaSun color="white" /> : <FaMoon color="black" />}
          </button>
        </nav>
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} />} />
          <Route path="/crop" element={<Crop darkMode={darkMode} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
