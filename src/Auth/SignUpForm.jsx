/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const SignUpForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');

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
                role: role 
            });

            setMessage("Compte créé avec succès !");
            console.log("Compte créé avec le rôle :", role);
        } catch (err) {
            setMessage("Erreur lors de la création du compte.");
            console.log(err);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 to-yellow-400 via-blue-500'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all hover:scale-105 duration-300'>
                <h2 className='text-4xl font-extrabold mb-6 text-gray-800 text-center'>Inscription</h2>

                <form className='space-y-4' onSubmit={handleSubmit}>
                    <label htmlFor="email" className='block text-lg text-gray-700'>
                        Email :
                        <input 
                            type="text" 
                            onChange={(e) => setEmail(e.target.value)} 
                            className='mt-2 w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400' 
                            required 
                        />
                    </label>

                    <label htmlFor="password" className='block text-lg text-gray-700'>
                        Mot de passe :
                        <input 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            className='mt-2 w-full p-3 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400' 
                            required 
                        />
                    </label>

                    <label htmlFor="role" className='block text-lg text-gray-700'>
                        Rôle :
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                            className='mt-2 w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                            required
                        >
                            <option value="user" className='text-black'>Utilisateur</option>
                        </select>
                    </label>

                    <button 
                        type='submit' 
                        className='w-full py-3 bg-blue-600 text-white rounded-md font-semibold text-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                        S'inscrire
                    </button>

                    {message && <p className='mt-4 text-green-600 text-center'>{message}</p>}

                    <p className='text-center text-gray-600 mt-6'>
                        Déjà inscrit ? <Link to="/" className='text-blue-500 font-semibold hover:underline'>Connexion</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUpForm;
