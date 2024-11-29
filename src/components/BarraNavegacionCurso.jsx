import React, { useContext } from 'react';
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Navbarcursos.css"; // Estilos personalizados
import { AuthContext } from '../context/AuthContext';

const NavbarCursos = () => {
  const { logout, loggedInUser } = useContext(AuthContext);
  const usuario = loggedInUser;

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    window.location.href = '/';
  };

  return (
    <Navbar
      expand="lg"
      className="navbar-cursos mb-3"
      style={{
        zIndex: 10,
        backgroundColor: '#ffffff', 
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        width: '100%',
        top: '0px'
      }}
    >
      <Navbar.Brand href="" className="logo-con-texto"></Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-cursos-nav" />
      <Navbar.Collapse id="navbar-cursos-nav">
        <Nav className="ml-auto" style={{ backgroundColor: '#ffffff' }}>
          <Nav.Link as={Link} to="/gestionar_usuarios">GESTIONAR USUARIOS</Nav.Link>
          <Nav.Link as={Link} to="/gestionar_cursos">GESTIONAR CURSOS</Nav.Link>
          <Nav.Link as={Link} to="/cursos">CURSOS</Nav.Link>
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="navbar-iconos" style={{ backgroundColor: '#ffffff', padding: '10px 20px' }}>
        <Nav className="ml-auto" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
          {/* Foto de perfil dinámica */}
          <img 
            src={usuario?.foto || "https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg"} 
            alt="perfil" 
            className="perfil-img" 
            style={{
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              objectFit: 'cover', 
              border: '2px solid #038731', 
              marginRight: '10px'
            }}
          />
          {/* Botón de cierre de sesión */}
          {usuario && (
            <Button 
              style={{
                backgroundColor: 'transparent', 
                borderColor: 'green', 
                color: 'green'
              }} 
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarCursos;
