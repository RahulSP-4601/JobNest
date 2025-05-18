import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './../css/navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  
  return (
    <header className="Navbar">
      <h1 className="header funnel-sans-navbar">
        <Link to="/home" onClick={closeMenu}>JobNest</Link>
      </h1>

      <nav className={`nav-right ${isOpen ? 'open' : ''}`}>
        <Link to="/about" className="header1 funnel-sans-navbar" onClick={closeMenu}>About</Link>
      </nav>

      <button
        className="hamburger"
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
        <div className={`bar ${isOpen ? 'open' : ''}`}></div>
      </button>
    </header>
  );
}

export default Navbar;
