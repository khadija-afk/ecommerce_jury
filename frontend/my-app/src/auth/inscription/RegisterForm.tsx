import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUser, UserData } from './userSlice';
import './RegisterForm.css'; // Importation du fichier CSS

const RegisterForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userStatus = useSelector((state: RootState) => state.user.status);
    const error = useSelector((state: RootState) => state.user.error);
    const user = useSelector((state: RootState) => state.user.user);

    const [formData, setFormData] = useState<UserData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        adresse: '',
        city: '',
        postale_code: '',
        country: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(registerUser(formData));
    };

    return (
        <div className="register-form">
            <h2>Inscription</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Prénom</label>
                    <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} />
                </div>
                <div className="form-group">
                    <label>Nom</label>
                    <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} />
                </div>
                <div className="form-group">
                    <label>Mot de passe</label>
                    <input type="password" name="password" onChange={handleChange} value={formData.password} />
                </div>
                <div className="form-group">
                    <label>Adresse</label>
                    <input type="text" name="adresse" onChange={handleChange} value={formData.adresse} />
                </div>
                <div className="form-group">
                    <label>Ville</label>
                    <input type="text" name="city" onChange={handleChange} value={formData.city} />
                </div>
                <div className="form-group">
                    <label>Code postal</label>
                    <input type="text" name="postale_code" onChange={handleChange} value={formData.postale_code} />
                </div>
                <div className="form-group">
                    <label>Pays</label>
                    <input type="text" name="country" onChange={handleChange} value={formData.country} />
                </div>
                <button type="submit">S'inscrire</button>
            </form>
            {userStatus === 'loading' && <p className="status-message loading">Chargement...</p>}
            {userStatus === 'succeeded' && user && <p className="status-message success">Utilisateur créé avec succès!</p>}
            {userStatus === 'failed' && <p className="status-message error">{error}</p>}
        </div>
    );
};

export default RegisterForm;
