import React from "react";
import "./header.css";

const Header = ({ toggleTheme, theme }) => {
  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">Welcome to My Portfolio</div>

        {/* Navigation */}
        <nav className="nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Theme Toggle */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </header>
  );
};

export default Header;
