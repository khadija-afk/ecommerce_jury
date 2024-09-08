import React from 'react'

import { Outlet } from 'react-router-dom';
//import { Container } from 'react-bootstrap'


import Header from './header/Header'
import MiniNavbar from './miniNav/MiniNavbare';
import Footer from './footer/Footer'

const Layout = () => {
  return (
    <>
    <Header/>
    <MiniNavbar/>
    <section >
       
       <Outlet />

        
    </section>

    <Footer/>
    
    
    
    
    
    </>
  )
}

export default Layout