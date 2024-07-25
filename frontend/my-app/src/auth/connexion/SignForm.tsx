import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../store';
import { signInUser } from './authSlice';
import styles from  '../../index.module.css';

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
        <div className={styles.sign}>
            <div className='container-fluid'>
            <form onSubmit={handleSubmit} className="mx-auto mt-20">
                <div>
                    <h2>Connexion</h2>
                </div>
                <div >
                    <label htmlFor=''>Email</label>
                    <input type="email" name="email" onChange={handleChange} className='form-control' />
                </div>
                <div >
                    <label htmlFor=''>Mot de passe</label>
                    <input type="password" name="password" onChange={handleChange} className='form-control' />
                </div>
                <div>
                    <button className= 'btn btn-success btn-block mt-3' >Se connecter</button>
                </div>
            </form>
            {authStatus === 'loading' && <p className="status-message loading">Chargement...</p>}
            {authStatus === 'succeeded' && <p className="status-message success">Connexion réussie!</p>}
            {authStatus === 'failed' && <p className="status-message error">{error}</p>}
            
            </div>
        </div>
    );
};

export default SignInForm;
