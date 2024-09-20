import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './auth/inscription/RegisterForm';
import SignInForm from './auth/connexion/SignForm';
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
import Checkout from './pages/checkout/Checkout.jsx'

// SERVICES
import PublicRoute  from './utils/helpers/PublicRoute';
import PrivateRoute from './utils/helpers/PrivateRoute';



//styles


const App = () => {
  return (
    <Router>
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
          </Route>

          {/* </Route> */}


          {/* // connexion */}

          <Route path="register" element={<RegisterForm />} />
          <Route path="sign" element={<SignInForm />} />



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
