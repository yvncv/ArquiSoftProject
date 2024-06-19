import React, { useContext, useEffect, useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const BarraNavegacion = ({ loggedInUser }) => {
  // Obtenemos el contexto de autenticación
  const { logout } = useContext(AuthContext);
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

  const handleLogout = () => {
    // Elimina el token de autenticación del almacenamiento local
    localStorage.removeItem('token');
    logout();
    window.location.href = '/login';
  };

  return (
    <Navbar expand="lg" className="bg-primary mb-3">
      <Container fluid>
        <Navbar.Brand className="text-white" href="#">Página web</Navbar.Brand>
        <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
        <Navbar.Collapse id="navbarNav">
          <Nav className="justify-content-end flex-grow-1">
            {loggedInUser ? (
              <>
                {loggedInUser.role === 'admin' ? <Nav.Link href="/crear_curso">Crear Curso</Nav.Link> : ""}
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                <Nav.Link href="/profile">Perfil</Nav.Link>
                <Nav.Link onClick={handleLogout} href='/'>Cerrar Sesión</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link href="/">Iniciar Sesión</Nav.Link>
                <Nav.Link href="/Register">Registrar</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default BarraNavegacion;