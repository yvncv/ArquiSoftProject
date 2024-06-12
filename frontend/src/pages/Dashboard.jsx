import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null); // Estado local para el usuario

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUsuario(decoded.usuario);
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
    <>
    <div>
      {/* Mensaje de bienvenida */}
      {usuario ? (
        <p>Hola {usuario.nombre}, bienvenido a la página</p>
      ) : (
        <p>Bienvenido, aún no has iniciado sesión</p>
      )}
    </div>
    </>
  );
};

export default Dashboard;