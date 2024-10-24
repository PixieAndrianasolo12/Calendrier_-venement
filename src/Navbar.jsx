import { Link, useNavigate } from 'react-router-dom'; // Importer useNavigate
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // Import des icônes
import { auth } from './firebase'; // Assurez-vous d'importer votre configuration Firebase
import { signOut } from 'firebase/auth'; // Importer la fonction signOut

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Initialiser useNavigate

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Déconnexion de l'utilisateur
      console.log("Déconnecté avec succès");
      navigate('/'); // Redirection vers la page de connexion
    } catch (error) {
      console.error("Erreur lors de la déconnexion : ", error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-[#4c6ef5] to-[#f39c12] p-4 shadow-md"> {/* Dégradé pour la Navbar */}
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Agenda Clone</h1>
        
        {/* Liens du menu pour les écrans moyens et plus */}
        <div className="hidden md:flex space-x-6">
          <Link to="/event" className="text-white hover:text-gray-300 transition-colors duration-300">
            Evenement
          </Link>
          <Link to="/calendrier" className="text-white hover:text-gray-300 transition-colors duration-300">
            Calendrier
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>

        {/* Bouton du menu mobile */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isOpen ? (
              <FaTimes className="w-6 h-6" />  // Icône pour fermer le menu
            ) : (
              <FaBars className="w-6 h-6" />  // Icône pour ouvrir le menu
            )}
          </button>
        </div>
      </div>
      
      {/* Menu mobile - si nécessaire */}
      {isOpen && (
        <div className="md:hidden flex flex-col space-y-4 mt-4">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors duration-300">
            Tâches
          </Link>
          <Link to="/calendrier" className="text-white hover:text-gray-300 transition-colors duration-300">
            Calendrier
          </Link>
          <button 
            onClick={handleLogout} 
            className="text-white hover:text-gray-300 transition-colors duration-300"
          >
            Déconnexion
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
