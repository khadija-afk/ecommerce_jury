import React from "react";
import { Link } from "react-router-dom";
import "./MiniNavbare.css";

interface MiniNavbarProps {
  handleNavLinkClick: (path: string) => void;
}

const MiniNavbar: React.FC<MiniNavbarProps> = ({ handleNavLinkClick }) => {
  return (
    <nav className="mini-navbar">
      <ul className="mini-navbar-list">
        <li className="mini-navbar-item">
          <Link to="/categorie/vetements" onClick={() => handleNavLinkClick("/categorie/vetements")}>
            Vêtements
          </Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/maquillage" onClick={() => handleNavLinkClick("/categorie/maquillage")}>
            Maquillage
          </Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/accessoires" onClick={() => handleNavLinkClick("/categorie/accessoires")}>
            Accessoires
          </Link>
        </li>
        <li className="mini-navbar-item">
          <Link to="/categorie/chaussures" onClick={() => handleNavLinkClick("/categorie/chaussures")}>
            Chaussures
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MiniNavbar;
