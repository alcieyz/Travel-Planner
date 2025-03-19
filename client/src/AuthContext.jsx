import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('username'));
    const [username, setUsername] = useState(localStorage.getItem('username') || '');
    const [contextName, setContextName] = useState(localStorage.getItem('name'));
    const [contextAvatar, setContextAvatar] = useState(localStorage.getItem('avatar') || '/uploads/TP_person_icon.png')

    const logIn = (username, name, avatar) => {
        localStorage.setItem('username', username);
        localStorage.setItem('name', name)
        localStorage.setItem('avatar', avatar || '/uploads/TP_person_icon.png');
        setIsLoggedIn(true);
        setUsername(username);
        setContextName(name);
        setContextAvatar(avatar || '/uploads/TP_person_icon.png');
    };

    const logOut = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('name');
        localStorage.removeItem('avatar');
        localStorage.removeItem('suggestions');
        setContextAvatar('/uploads/TP_person_icon.png');
        setIsLoggedIn(false);
    };

    const updateName = (newName) => {
        localStorage.setItem('name', newName);
        setContextName(newName);
    }

    const updateAvatar = (newAvatar) => {
        localStorage.setItem('avatar', newAvatar);
        setContextAvatar(newAvatar);
    }

    return(
        <AuthContext.Provider value={{isLoggedIn, username, contextName, contextAvatar, logIn, logOut, updateName, updateAvatar}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);