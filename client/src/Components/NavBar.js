import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './NavBar.css';

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        const data = await res.json();
        if (res.ok) setUsername(data.user.username);
        else {
          localStorage.removeItem("token");
          setUsername(null);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        localStorage.removeItem("token");
        setUsername(null);
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/"); // client-side navigation
  };

  return (
    <nav>
      <div className="logo" onClick={() => navigate('/')}>
        HappenIn
      </div>

      <div className="links">
        <div onClick={() => window.location.href='/lost-found'}>Lost & Found</div>
        <div onClick={() => window.location.href='/book-resources'}>Book Resources</div>
        <div onClick={() => window.location.href='/faculty'}>Faculty</div>
        <Link to="/mini-games">Mini Games</Link> {/* React Router */}
        <div onClick={() => window.location.href='/profile'}>Profile</div>
        <div onClick={() => window.location.href='/about'}>About Us</div>
      </div>

      {!username ? (
        <div className="auth-buttons">
          <button onClick={() => window.location.href='/login'}>Login</button>
          <button onClick={() => window.location.href='/signup'}>Signup</button>
        </div>
      ) : (
        <p id="usernameDisplay" style={{ fontWeight: 'bold' }}>
          Welcome, {username} <button onClick={handleLogout}>Logout</button>
        </p>
      )}
    </nav>
  );
};

export default Navbar;
