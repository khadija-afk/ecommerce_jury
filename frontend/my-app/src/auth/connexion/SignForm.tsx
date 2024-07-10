import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { signInUser } from './authSlice';
import './SignForm.css'; // Importation du fichier CSS

const SignInForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const authStatus = useSelector((state: RootState) => state.auth.status);
    const error = useSelector((state: RootState) => state.auth.error);
    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(signInUser(credentials));
    };

    useEffect(() => {
        if (authStatus === 'succeeded') {
            navigate('/article/add'); // Rediriger vers la page d'ajout d'article
        }
    }, [authStatus, navigate]);

    return (
        <div className="signin-form">
            <h2>Connexion</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" name="password" onChange={handleChange} />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            {authStatus === 'loading' && <p className="status-message loading">Chargement...</p>}
            {authStatus === 'succeeded' && <p className="status-message success">Connexion réussie!</p>}
            {authStatus === 'failed' && <p className="status-message error">{error}</p>}
        </div>
    );
};

export default SignInForm;
