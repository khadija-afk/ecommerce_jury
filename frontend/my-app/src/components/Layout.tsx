import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import MiniNavbar from './miniNav/MiniNavbare';
import Footer from './footer/Footer';
import './Layout.css'

const Layout = () => {
  const handleNavLinkClick = (path: string) => {
    console.log(`Navigation vers : ${path}`);
    // Ajoutez ici une logique supplémentaire si nécessaire
  };

  return (
    <>
      <div className="page-container"></div>
      <Header />
      {/* Passez la fonction handleNavLinkClick à MiniNavbar */}
      <MiniNavbar handleNavLinkClick={handleNavLinkClick} />
      <section style={{ margin: '20px 0' }}>
        <Outlet />
      </section>
      <Footer />
    </>
  );
};


export default Layout;
