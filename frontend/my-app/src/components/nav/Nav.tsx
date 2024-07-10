// src/components/Navbar/Navbar.tsx
import React, { useEffect, useState } from 'react';
import './Nav.css';

const Navbar: React.FC = () => {
    const [navbarActive, setNavbarActive] = useState(false);

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setNavbarActive(true);
        } else {
            setNavbarActive(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <nav className={`navbar navbar-expand-lg fixed-top ${navbarActive ? 'active' : ''}`}>
            <a href="/" className="navbar-brand">MyApp</a>
            <div className="navbar-nav">
                <a href="/signin" className="nav-link">Sign In</a>
                <a href="/register" className="nav-link">Register</a>
            </div>
        </nav>
    );
};

export default Navbar;
