/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate();
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                const role = userData.role;

                console.log("Connexion réussie. Le rôle de l'utilisateur est :", role);

                if (role === 'admin') {
                    navigate('/admin-dashboard'); 
                } else {
                    navigate('/user-dashboard'); 
                }
            } else {
                setError("Aucun document trouvé pour cet utilisateur !");
            }
        } catch (err) {
            switch (err.code) {
                case 'auth/wrong-password':
                    setError("Mot de passe incorrect. Veuillez réessayer.");
                    break;
                case 'auth/user-not-found':
                    setError("Identifiant incorrect. Veuillez vérifier votre email.");
                    break;
                case 'auth/invalid-email':
                    setError("Format d'email invalide.");
                    break;
                case 'auth/too-many-requests':
                    setError("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
                    break;
                default:
                    setError("Erreur lors de la connexion. vérifier votre email ou mot de passe.");
                    console.error("Erreur non prévue:", err);
                    break;
            }
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-orange-400 to-yellow-400 via-blue-500'>
            <div className='bg-white p-8 rounded-lg shadow-lg w-full max-w-md transition-all hover:scale-105 duration-300'>
                <h2 className='text-4xl font-extrabold mb-6 text-gray-800 text-center'>Connexion</h2>

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

                    {error && (
                        <p className='text-red-600 bg-red-100 border border-red-500 p-3 rounded text-center'>
                            {error}
                        </p>
                    )}

                    <button 
                        type='submit' 
                        className='w-full py-3 bg-blue-600 text-white rounded-md font-semibold text-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    >
                        Connexion
                    </button>

                    <p className='text-center text-gray-600 mt-6'>
                        Vous n'avez pas de compte ? <Link to="/signup" className='text-blue-500 font-semibold hover:underline'>Inscrivez-vous</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
