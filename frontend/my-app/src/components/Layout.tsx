import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import MiniNavbar from './miniNav/MiniNavbare';
import Footer from './footer/Footer';
import './Layout.css'

const Layout = () => {
  return (
    <>
     <div className="page-container"></div>
      <Header />
      <MiniNavbar />
      <section style={{ margin: '20px 0' }}> {/* Ajout de marge pour espacement */}
        <Outlet /> {/* Home.js sera chargé ici */}
      </section>
      <Footer />
    </>
  );
};

export default Layout;
