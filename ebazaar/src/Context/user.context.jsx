import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect } from "react";
import { createContext, useState } from "react";
import { db } from "../firebase";

export const UserContext = createContext({
    currentUser: null,
    setCurrentUser: () => null,
})

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userDB, setUserDB] = useState(null);
    const [afk, setAFK] = useState(false);
    const value = { currentUser, setCurrentUser, userDB, setUserDB, afk, setAFK };

    useEffect(() => {
        let unsubscribe = null;

        if (currentUser && currentUser.uid) {
            const docRef = doc(db, "users", currentUser.uid);

            // Listen to live updates! 
            // If the document is created milliseconds *after* login (like during Sign-Up),
            // this guarantees the Context will catch the creation event immediately!
            unsubscribe = onSnapshot(docRef, (docSnap) => {
                if (docSnap.exists()) {
                    setUserDB(docSnap.data());
                } else {
                    console.log("Waiting for user document to be initialized...");
                    setUserDB(null);
                }
            });
        } else {
            setUserDB(null);
        }

        return () => {
            if (unsubscribe) unsubscribe();
        }
    }, [currentUser]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}
