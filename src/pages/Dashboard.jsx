import React, { useEffect, useState } from "react";
import { usuarios, cursos, sesiones, semanas } from '../data';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null); // Estado local para el usuario

  useEffect(() => {
    const obtenerUsuario = () => {
      try {
        const token = localStorage.getItem('token'); // Obtener el token
        if (token) {
          // Buscar el usuario basado en el token, aquí asumimos que el token contiene el 'id' del usuario
          const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificar el payload del JWT (sin usar jwt-decode)
          const usuarioEncontrado = usuarios.find(user => user.id === decoded.usuario.id);
          setUsuario(usuarioEncontrado);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    };

    obtenerUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      console.log(`Bienvenido, ${usuario.nombre}`);
    }
  }, [usuario]); // Ejecutar este efecto cuando `usuario` cambie

  return (
    <div>
      {/* Mensaje de bienvenida */}
      {usuario ? (
        <p>Hola {usuario.nombre}, bienvenido a la página</p>
      ) : (
        <p>Bienvenido, aún no has iniciado sesión</p>
      )}
    </div>
  );
};

export default Dashboard;
