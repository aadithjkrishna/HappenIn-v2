// Home.js
import React from "react";
import "./Home.css"; // CSS for Home page
import Navbar from "../Components/NavBar";

const Home = () => {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <h1>HappenIn</h1>
        <p>
          Want to enjoy, cherish, and smoothly organize your campus life? HappenIn
          connects you with events, resources, and the people who make it happen — all in one place.
        </p>

        <div className="action-buttons">
          <button onClick={() => (window.location.href = "/calendar")}>
            Check Availability
          </button>
          <button onClick={() => (window.location.href = "/event-register")}>
            Register
          </button>
          <div className="dino-icon" id="dino" title="Mini Game"></div>
        </div>
      </section>
    </div>
  );
};

export default Home;
