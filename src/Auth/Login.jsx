/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import './auth.css'; // Remplacez l'importation ici

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); 
    const db = getFirestore();

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                console.log("Aucun document trouvé !");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className='app-main'> {/* Utilisez app-main pour le fond dégradé */}
            <div className='app-container'> {/* Appliquez le style de conteneur */}
                <h2 className='text-3xl font-bold mb-6 text-white text-center'>Connexion</h2>

                <form className='flex flex-col' onSubmit={handleSubmit}>
                    <label htmlFor="email" className='block mb-2 text-white'>
                        Email :
                        <input 
                            type="text" 
                            onChange={(e) => setEmail(e.target.value)} 
                            className='app-input' // Appliquez le style d'entrée
                            required 
                        />
                    </label>

                    <label htmlFor="password" className='block mb-2 text-white'>
                        Mot de passe :
                        <input 
                            type="password" 
                            onChange={(e) => setPassword(e.target.value)} 
                            className='app-input' // Appliquez le style d'entrée
                            required 
                        />
                    </label>

                    <button 
                        type='submit' 
                        className='app-button mt-4' // Appliquez le style de bouton
                    >
                        Connexion
                    </button>

                    <p className='app-text'>
                        Vous n'avez pas de compte ? <Link to="/signup" className='text-blue-500 hover:underline'>Inscrivez-vous</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
