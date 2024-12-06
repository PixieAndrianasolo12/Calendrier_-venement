/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, updateDoc, doc, setDoc, deleteDoc, getDocs, where } from 'firebase/firestore';
import UserList from './UserList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

const Groupe = () => {
    const [users, setUsers] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [newGroup, setNewGroup] = useState('');
    const [groups, setGroups] = useState([]);

    // Récupérer les utilisateurs et les groupes depuis Firestore
    useEffect(() => {
        const q = query(collection(db, 'users'));
        const unsubscribeUsers = onSnapshot(q, (snapshot) => {
            const usersArray = [];
            snapshot.forEach((doc) => {
                usersArray.push({ ...doc.data(), id: doc.id });
            });
            setUsers(usersArray);
        });

        const groupQuery = query(collection(db, 'groups'));
        const unsubscribeGroups = onSnapshot(groupQuery, (snapshot) => {
            const groupsArray = [];
            snapshot.forEach((doc) => {
                groupsArray.push(doc.data().name);
            });
            setGroups(groupsArray);
        });

        return () => {
            unsubscribeUsers();
            unsubscribeGroups();
        };
    }, []);

    // Fonction pour changer le groupe d'un utilisateur
    const changeUserGroup = async (userId, newGroup) => {
        const userDoc = doc(db, 'users', userId);
        await updateDoc(userDoc, { group: newGroup });
        console.log(`Groupe de l'utilisateur avec l'ID ${userId} changé en ${newGroup}`);
    };

    // Actions pour éditer un utilisateur
    const toggleEdit = (user) => {
        console.log("Édition de l'utilisateur :", user);
    };

    // Filtrer les utilisateurs en fonction du groupe sélectionné
    const filteredUsers = selectedGroup
        ? users.filter((user) => user.group === selectedGroup)
        : users;

    // Fonction pour ajouter un nouveau groupe
    const addGroup = async () => {
        if (newGroup && !groups.includes(newGroup)) {
            setGroups([...groups, newGroup]);
            setNewGroup('');

            // Sauvegarder le groupe dans Firestore
            const groupDoc = doc(collection(db, 'groups'));
            await setDoc(groupDoc, { name: newGroup });
        }
    };

    // Fonction pour supprimer un groupe
    const deleteGroup = async (groupName) => {
        const groupQuery = query(collection(db, 'groups'), where('name', '==', groupName));
        const groupSnapshot = await getDocs(groupQuery);
        groupSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
            console.log(`Groupe ${groupName} supprimé`);
        });

        setGroups(groups.filter(group => group !== groupName));
    };

    return (
        <div className="container mx-auto p-4 bg-white shadow-lg rounded-md">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Liste des Utilisateurs</h1>
            
            <div className="space-y-2 mb-6">
                {groups.map(group => (
                    <div key={group} className="flex items-center space-x-3">
                        <span
                            className="text-blue-600 cursor-pointer hover:underline"
                            onClick={() => setSelectedGroup(group)}
                        >
                            Afficher {group}
                        </span>
                        <button
                            className="text-red-500 p-1 transition-transform transform hover:scale-110"
                            onClick={() => deleteGroup(group)}
                        >
                            <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                    </div>
                ))}
                
                <span 
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setSelectedGroup('')}
                >
                    Afficher Tous
                </span>
            </div>

            {/* Section pour ajouter un nouveau groupe */}
            <div className="flex space-x-3 mb-6">
                <input
                    type="text"
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    placeholder="Ajouter un nouveau groupe"
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={addGroup}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Ajouter
                </button>
            </div>

            <ul className="space-y-4">
                {filteredUsers.map((user) => (
                    <UserList
                        key={user.id}
                        user={user}
                        toggleEdit={toggleEdit}
                        handleGroupChange={changeUserGroup}
                        selectedGroup={selectedGroup}
                        groups={groups}
                    />
                ))}
            </ul>
        </div>
    );
}

export default Groupe;
