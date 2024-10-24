/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './Auth.css';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user'); // Rôle par défaut
    const [message, setMessage] = useState(''); // État pour le message

    // Configuration Firestore
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Créer un document utilisateur dans Firestore avec son rôle
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                role: role // 'user' par défaut ou 'admin' selon la logique
            });

            setMessage("Compte créé avec succès !"); // Mettre à jour le message
            console.log("Compte créé avec le rôle :", role);
        } catch (err) {
            setMessage("Erreur lors de la création du compte."); // Mettre à jour le message en cas d'erreur
            console.log(err);
        }
    };

    return (
        <div className='app-main'> {/* Utilisez app-main pour le fond dégradé */}
            <div className='app-container'> {/* Appliquez le style de conteneur */}
                <h2 className='text-3xl font-bold mb-6 text-white'>Inscription</h2>

                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <label htmlFor="email" className='block mb-2 text-white'>
                        Email :
                        <input 
                            type="text" 
                            onChange={(e) => setEmail(e.target.value)} 
                            className='app-input' 
                            required 
                        />
                    </label>

                    <label htmlFor="password" className='block mb-2 text-white'>
                        Mot de passe :
                        <input 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            className='app-input' 
                            required 
                        />
                    </label>

                    <label htmlFor="role" className='block mb-2 text-white'>
                        Rôle :
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            className='app-input bg-gray-700 text-white' // Couleur de fond et de texte
                            required
                        >
                            <option value="user" className='text-black'>Utilisateur</option>
                            <option value="admin" className='text-black'>Administrateur</option>
                        </select>
                    </label>

                    <button 
                        type='submit' 
                        className='app-button mt-4'
                    >
                        S'inscrire
                    </button>

                    {message && <p className='mt-4 text-white'>{message}</p>} {/* Afficher le message */}

                    <p className='mt-4 text-white'>
                        Déjà inscrit ? <Link to="/" className='text-blue-500 hover:underline'>Connexion</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
