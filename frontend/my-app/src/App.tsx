import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RegisterForm from './auth/inscription/RegisterForm';
import SignInForm from './auth/connexion/SignForm';
import ArticleList from './features/article/ArticleList';
import AddArticleForm from './features/article/AddArticleForm';
import AddCategoryForm from './features/category/AddCategoryForm';
import AddReviewForm from './features/review/AddReviewForm';
import HomePage from './pages/home'

//import HomePage from './pages/home';
import Layout from './components/Layout';


const App = () => {
    return (
        <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<HomePage />} /> {/* Route pour la page d'accueil */}
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/sign" element={<SignInForm />} />
                        <Route path="/article" element={<ArticleList />} />
                        <Route path="/article/add" element={<AddArticleForm />} />
                        <Route path="/category/add" element={<AddCategoryForm />} />
                        <Route path="/review/add" element={<AddReviewForm />} />
                    </Route>
                </Routes>
        </Router>
    );
};



export default App;
