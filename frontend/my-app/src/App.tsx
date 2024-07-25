import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './auth/inscription/RegisterForm';
import SignInForm from './auth/connexion/SignForm';
import ArticleList from './features/article/ArticleList';
import AddArticleForm from './features/article/AddArticleForm';
import AddCategoryForm from './features/category/AddCategoryForm';
import AddReviewForm from './features/review/AddReviewForm';
import Detail from './features/article/DetailArticle';
import Panier from './pages/Panier';
import HomePage from './pages/Home';
import Layout from './components/Layout';

// SERVICES
import PublicRoute  from './utils/helpers/PublicRoute'
import PrivateRoute from './utils/helpers/PrivateRoute'


const App = () => {
  return (
    <Router>
      <Routes>
       
          <Route path = '/' element = {<Layout/>}>
          <Route index element={<HomePage />} /> {/* Route pour la page d'accueil */}
          <Route element={<PublicRoute/>}>
          <Route path="register" element={<RegisterForm />} />
          <Route path="sign" element={<SignInForm />} />
          </Route>
          <Route path="article" element={<ArticleList />} />
          <Route path="review/add" element={<AddReviewForm />} />
          <Route path="api/article/:id" element={<Detail />} />
          <Route path = "/panier" element = {<Panier />} />
          <Route element={<PrivateRoute/>}>
          <Route path="article/add" element={<AddArticleForm />} />
          <Route path="category/add" element={<AddCategoryForm />} />
          </Route>

          </Route>
        
      </Routes>
    </Router>
  );
};

export default App;
