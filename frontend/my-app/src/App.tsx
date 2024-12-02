import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navigate } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

// Pages principales
import RegisterForm from './pages/auth/inscription/RegisterForm';
import SignInForm from './pages/auth/connexion/SignForm';
import ArticleList from './features/article/ArticleList';
import Detail from './features/article/DetailArticle';
import Panier from './pages/panier/Panier';
import HomePage from './pages/home/home';
import Layout from './components/Layout';
import PaymentSuccessPage from './components/stripe/Successe';
import PaymentFailedPage from './components/stripe/Canceled';
import FavorisPage from './pages/favorie/Favorite';

// Checkout
import Checkout from './pages/checkout/Checkout';

// Recherche
import SearchResults from './pages/search/SearcheReasulte';
import NoResults from './pages/search/NoResult';

// Services
import PrivacyPolicy from './pages/confidentialite/PrivacyPolic';
import CookieSettings from './pages/confidentialite/CookieSetting';
import TermsAndConditions from './pages/confidentialite/TermeAndCondition';

// Cookies
import CookieConsentModal from './components/cookieModel/CookieConsentModel';
import CookieSettingsModal from './components/cookieModel/CookieSettingModel';

// Profil
import UserProfilePage from './pages/profil/profil';
import UserOrders from './components/profil/userOrder';
import UserProfile from './components/profil/profil'; 
import UserAddresses from './components/profil/AdresseUser';

// Autres catégories
import VetementsPage from './pages/category/vetement/VetPage';
import MaquillagePage from './pages/category/maquillage/MaqPage';
import AccessoiresPage from './pages/category/accessoire/AccPage';
import ChaussuresPage from './pages/category/chaussure/ChaussPage';

// Forget password
import ForgotPasswordPage from './pages/forgetPasse/ForgotPasswordPage';
import ResetPasswordPage from './pages/forgetPasse/ResetPasswordPage';
import ResetPasswordSuccess from './pages/forgetPasse/ReasetPasswordsuccéss';

//A2F
import TwoFactorAuthPage from './pages/A2F/GenerateA2F';
import Verify2FAPage from './pages/A2F/VerefieA2F';
import Disable2FAPage from './pages/A2F/DesactiveA2F';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);


  // Ouverture du modal pour les réglages des cookies
  const openCookieSettings = () => setShowCookieSettings(true);

  return (
    <Router>
      {/* Modal de consentement */}
      <CookieConsentModal onOpenSettings={openCookieSettings} />

      {/* Modal de réglages des cookies */}
      {showCookieSettings && (
        <CookieSettingsModal onClose={() => setShowCookieSettings(false)} />
      )}

      <Routes>
        {/* Routes principales */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="article" element={<ArticleList />} />
          <Route path="detailArticle/:id" element={<Detail />} />
          <Route path="panier" element={<Panier />} />
          <Route path="checkout/:orderId" element={<Checkout />} />
          <Route path="success" element={<PaymentSuccessPage />} />
          <Route path="cancel" element={<PaymentFailedPage />} />
          <Route path="favoris" element={<FavorisPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="no-results" element={<NoResults />} />
          <Route path="categorie/vetements" element={<VetementsPage />} />
          <Route path="categorie/maquillage" element={<MaquillagePage />} />
          <Route path="categorie/accessoires" element={<AccessoiresPage />} />
          <Route path="categorie/chaussures" element={<ChaussuresPage />} />

          {/* Profil avec sous-routes */}
          <Route path="profil" element={<UserProfilePage />}>
            <Route index element={<Navigate to="orders" replace />} /> {/* Redirection */}
            <Route path="orders" element={<UserOrders />} />
            <Route path="security" element={<UserProfile />} />
            <Route path="adresse" element={<UserAddresses />} />
            <Route path="A2FGenerat" element={< TwoFactorAuthPage/>} />
            <Route path="A2FVerefiy" element={<Verify2FAPage />} />
            <Route path="A2FDesactive" element={<Disable2FAPage />} />
            
          </Route>

          {/* Politique de confidentialité */}
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="cookie-settings" element={<CookieSettings />} />
          <Route path="terms-conditions" element={<TermsAndConditions />} />
        </Route>
        <Route path="register" element={<RegisterForm />} />
        <Route path="sign" element={<SignInForm />} />

        {/* Mot de passe oublié */}
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="reset-password-success" element={<ResetPasswordSuccess />} />
      </Routes>
    </Router>
  );
};

export default App;
