import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
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
          <p>{usuario.email}</p>
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
            <strong>Coreo electrónico:</strong> {usuario.email}
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
