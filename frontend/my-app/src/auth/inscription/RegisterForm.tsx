import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { registerUser, UserData } from './userSlice';
import styles from '../../index.module.css'

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
        <div className={styles.registre}>
            <div className='container-fluid'>
            <form onSubmit={handleSubmit} className="mx-auto mt-20">
                <div className=" text-3xl text-success">
                    <h2>Veuillez vous inscrire</h2>
                </div>
                <div >
                    <label htmlFor=''>Prénom</label>
                    <input type="text" name="firstName" onChange={handleChange} value={formData.firstName} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Nom</label>
                    <input type="text" name="lastName" onChange={handleChange} value={formData.lastName} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Email</label>
                    <input type="email" name="email" onChange={handleChange} value={formData.email} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Mot de passe</label>
                    <input type="password" name="password" onChange={handleChange} value={formData.password} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Adresse</label>
                    <input type="text" name="adresse" onChange={handleChange} value={formData.adresse} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Ville</label>
                    <input type="text" name="city" onChange={handleChange} value={formData.city} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Code postal</label>
                    <input type="text" name="postale_code" onChange={handleChange} value={formData.postale_code} className='form-control'/>
                </div>
                <div >
                    <label htmlFor=''>Pays</label>
                    <input type="text" name="country" onChange={handleChange} value={formData.country} className='form-control'/>
                </div>
                <div>
                    <button className= 'btn btn-success btn-block mt-3'>S'inscrire</button>
                </div>
            </form>
            {userStatus === 'loading' && <p className="status-message loading">Chargement...</p>}
            {userStatus === 'succeeded' && user && <p className="status-message success">Utilisateur créé avec succès!</p>}
            {userStatus === 'failed' && <p className="status-message error">{error}</p>}
            </div>
        </div>
    );
};

export default RegisterForm;
