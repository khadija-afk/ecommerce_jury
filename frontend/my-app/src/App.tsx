import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './auth/inscription/RegisterForm';
import SignInForm from './auth/connexion/SignForm';
import ArticleList from './features/article/ArticleList';
import AddCategoryForm from './features/category/AddCategoryForm';
import AddReviewForm from './features/review/AddReviewForm';
import Detail from './features/article/DetailArticle';
import Panier from './pages/Panier';
import HomePage from './pages/home';
import Layout from './components/Layout';
import Users from './dashbord/user/Users';
import Articles from './dashbord/article/Articles';

// SERVICES
import PublicRoute  from './utils/helpers/PublicRoute'
import PrivateRoute from './utils/helpers/PrivateRoute'


const App = () => {
  return (
    <Router>
      <Routes>
       
        <Route path = '/' element = {<Layout/>}>  {/* Nav pour les anonymous utilisateur */}

          <Route element={<PublicRoute/>}>    {/* Route pour les utilisateur  */}

            <Route index element={<HomePage />} /> 
            <Route path="register" element={<RegisterForm />} />
            <Route path="sign" element={<SignInForm />} />
            <Route path="article" element={<ArticleList />} />
            <Route path="review/add" element={<AddReviewForm />} />
            <Route path="api/article/:id" element={<Detail />} />
            <Route path = "/panier" element = {<Panier />} />

          </Route>

        
           
           
          <Route element={<PrivateRoute/>}>   {/* Route pour admin */}

            <Route path="category/add" element={<AddCategoryForm />} />
            <Route path="user" element={<Users />} />
            <Route path="articles" element={<Articles />} />
          
          </Route>

        </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
