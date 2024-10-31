import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './pages/auth/inscription/RegisterForm';
import SignInForm from './pages/auth/connexion/SignForm';
import ArticleList from './features/article/ArticleList';
import AddCategoryForm from './features/category/AddCategoryForm';
import Detail from './features/article/DetailArticle';
import Panier from './pages/panier/Panier';
import HomePage from './pages/home/home';
import Layout from './components/Layout';
import Users from './dashbord/user/Users';
import Articles from './dashbord/article/Articles';
import Success from './components/stripe/Successe';
import Canceled from './components/stripe/Canceled';
import Page from './dashbord/page';
import FavorisPage from './pages/favorie/Favorite';

//ORDRS
import Checkout from './pages/checkout/Checkout.js'

//SEARCHE
import SearchResults from './pages/search/SearcheReasulte';
import NoResults from './pages/search/NoResult';

// SERVICES
import PublicRoute  from './utils/helpers/PublicRoute';
import PrivateRoute from './utils/helpers/PrivateRoute';

//FORGETPASSE
import ForgotPasswordPage from './pages/forgetPasse/ForgotPasswordPage';
import OTPVerificationPage from './pages/forgetPasse/OTPVerificationPage';
import ResetPasswordPage from './pages/forgetPasse/ResetPasswordPage';
import ResetPasswordSuccess from './pages/forgetPasse/ReasetPasswordsuccéss';

//CATEGORY
import VetementsPage from './pages/category/vetement/VetPage';
import MaquillagePage from './pages/category/maquillage/MaqPage';
import AccessoiresPage from './pages/category/accessoire/AccPage';
import ChaussuresPage from './pages/category/chaussure/ChaussPage';


//Confidentialite
import PrivacyPolicy from './pages/confidentialite/PrivacyPolic';
import CookieSettings from './pages/confidentialite/CookieSetting';
import TermsAndConditions from './pages/confidentialite/TermeAndCondition';


//COOKIECONSENT
import CookieConsentModal from './components/cookieModel/CookieConsentModel';
import CookieSettingsModal from './components/cookieModel/CookieSettingModel';





//styles


const App = () => {

  
  const [showCookieSettings, setShowCookieSettings] = useState(false);

  // Fonction pour afficher le modal de réglage des cookies
  const openCookieSettings = () => setShowCookieSettings(true);

  return (
    <Router>
                {/* Modal de consentement avec bouton pour ouvrir les paramètres */}
                <CookieConsentModal onOpenSettings={openCookieSettings} />

            {/* Modal de paramétrage des cookies, contrôlé par l'état */}
            {showCookieSettings && (
              <CookieSettingsModal onClose={() => setShowCookieSettings(false)} />
            )}

      <Routes>
       
        <Route path = '/' element = {<Layout/>}>  {/* Nav pour les anonymous utilisateur */}

         {/* <Route element={<PublicRoute/>}>    Route pour les utilisateur  */}

            <Route index element={<HomePage />} /> 
            <Route path="article" element={<ArticleList />} />
            <Route path="api/article/:id" element={<Detail />} />
            <Route path = "/panier" element = {<Panier />} />
            <Route path ="/checkout" element ={<Checkout />} />
            <Route path = "/success" element = {<Success />} />
            <Route path = "/cancel" element = {<Canceled />} />
            <Route path = "/favoris" element = {<FavorisPage/>} />
            <Route path = "/search" element = {<SearchResults/>} />
            <Route path="/no-results" element={<NoResults/>} />
            <Route path="/categorie/vetements" element={<VetementsPage/>} />
            <Route path="/categorie/maquillage" element={<MaquillagePage/>} />
            <Route path="/categorie/accessoires" element={<AccessoiresPage/>} />
            <Route path="/categorie/chaussures" element={<ChaussuresPage/>} />

            {/* confidentialite */}
            <Route path="/privacy-policy" element={<PrivacyPolicy/>} />
            <Route path="/cookie-settings" element={<CookieSettings/>} />
            <Route path="/terms-conditions" element={<TermsAndConditions/>} />
            

          </Route>

          {/* </Route> */}


          {/* // connexion */}

          <Route path="register" element={<RegisterForm />} />
          <Route path="sign" element={<SignInForm />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPVerificationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password-success" element={<ResetPasswordSuccess />} />



            {/* <Route element={<PrivateRoute/>}>   Route pour admin */}
            <Route path="category/add" element={<AddCategoryForm />} />
            <Route path="user" element={<Users />} />
            <Route path="articles" element={<Articles />} />
            <Route path="admin" element={<Page />} />

          {/* </Route> */}

      </Routes>

    </Router>
  );
};

export default App;
