import React, { createContext, useState, useEffect } from 'react';
import { usuarios } from '../data'; // Asegúrate de importar los usuarios generados

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
      setLoggedInUser(JSON.parse(storedUser));
    } else {
      // Asignar un usuario aleatorio si no hay usuario autenticado en localStorage
      const randomUser = usuarios[Math.floor(Math.random() * usuarios.length)];
      setLoggedInUser(randomUser);
      localStorage.setItem('loggedInUser', JSON.stringify(randomUser)); // Guardar el usuario aleatorio en localStorage
    }
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Función para iniciar sesión
  const login = (usuario) => {
    localStorage.setItem('loggedInUser', JSON.stringify(usuario));
    setLoggedInUser(usuario);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
