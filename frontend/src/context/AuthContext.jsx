import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto de autenticación
export const AuthContext = createContext();

// Creamos un componente proveedor para el contexto de autenticación
export const AuthProvider = ({ children }) => {
  // Estado para almacenar el usuario autenticado
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Al cargar la aplicación, intentamos recuperar el usuario autenticado desde el almacenamiento local
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(storedUser);
    }
  }, []);

  // Función para iniciar sesión
  const login = (usuario) => {
    localStorage.setItem('loggedInUser', usuario);
    setLoggedInUser(usuario);
  };

  // Función para cerrar sesión
  const logout = (usuario) => {
    localStorage.removeItem('loggedInUser', usuario);
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};