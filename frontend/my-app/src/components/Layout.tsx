import React from 'react';
import { Outlet } from 'react-router-dom';

import Header from './header/Header';
import MiniNavbar from './miniNav/MiniNavbare';
import Footer from './footer/Footer';

const Layout = () => {
  return (
    <>
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
