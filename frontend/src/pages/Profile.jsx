import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { usuarios, cursos, sesiones, semanas } from '../data';

const Profile = () => {
  const [usuario, setUsuario] = useState(null); // Estado local para el usuario

  useEffect(() => {
    const obtenerUsuario = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Simulamos la obtención del usuario usando el código almacenado en el token
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decodificamos el token JWT simulado
        const usuarioEncontrado = usuarios.find(u => u.codigo === decoded.codigo); // Usamos el código para buscar al usuario
        setUsuario(usuarioEncontrado);
      }
    };
    
    obtenerUsuario();
  }, []);

  if (!usuario) return <p>Cargando...</p>;

  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12} className="text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="rounded-circle mb-3"
          />
          <h2>{usuario.nombre}</h2>
          <p>{usuario.correo || 'Correo no disponible'}</p>
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="mx-auto">
          <h4>Detalles del Usuario</h4>
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>Código:</strong> {usuario.codigo}
          </p>
          <p>
            <strong>Carrera:</strong> {usuario.carrera}
          </p>
          <p>
            <strong>Ciclo:</strong> {usuario.ciclo}
          </p>
          <p>
            <strong>Correo electrónico:</strong> {usuario.correo || 'Correo no disponible'}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
