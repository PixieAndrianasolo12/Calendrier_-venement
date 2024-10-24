import React, { useEffect } from 'react'
import { auth } from './firebase'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const UserProfile = () => {
    const [user, setUser] = React.useState(null)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
            if (user) {
                fetchUserData(user.email)
            } else {
                setUser(null)
            }
        })
        return unsubscribe
    }, [])

    const fetchUserData = async (email) => {
        const db = firebase.database()
        const userRef = db.ref(`users/${email}`)
        const snapshot = await userRef.once('value')
        const userData = snapshot.val()
        setUser(userData)
    }

    if (!user) return <div>Chargement...</div>

    return (
        <div>
            <h1>{user.nom} {user.prenom}</h1>
            <p>Email: {user.email}</p>
            <p>Rôle: {user.role}</p>
            {/* Affichez d'autres informations utilisateur ici */}
        </div>
    )
}

export default UserProfile
