import React, { useContext } from 'react';
import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Navbarcursos.css"; // Puedes usar esto para estilos personalizados
import { AuthContext } from '../context/AuthContext';

const NavbarCursos = () => {
  // Obtenemos el contexto de autenticación
  const { logout, loggedInUser } = useContext(AuthContext);
  const usuario = loggedInUser

  const handleLogout = () => {
    // Elimina el token de autenticación del almacenamiento local
    localStorage.removeItem('token');
    logout();
    window.location.href = '/';
  };

  return (
    <Navbar expand="lg" className="navbar-cursos mb-3">
      <Navbar.Brand href="" className="logo-con-texto"></Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-cursos-nav" />
      <Navbar.Collapse id="navbar-cursos-nav">
        <Nav className="ml-auto">
          {/* {console.log(rolUser)} */}
          {usuario.role === 'admin' ? (
            <>
              <Nav.Link as={Link} to="/gestionar_usuarios">
                GESTIONAR USUARIOS
              </Nav.Link>
              <Nav.Link as={Link} to="/gestionar_cursos">
                GESTIONAR CURSOS
              </Nav.Link>
            </>
          ) : usuario.role === 'alumno' ? (
            <>
              <Nav.Link as={Link} to="/cursos">
                CURSOS
              </Nav.Link>
            </>
          ) : (
            ''
          )}
        </Nav>
      </Navbar.Collapse>
      <Navbar.Collapse className="navbar-iconos">
        <Nav className="ml-auto">
          <FontAwesomeIcon icon="bell" className="icon-custom" />
        </Nav>
        <Nav className="ml-auto">
          <FontAwesomeIcon icon="comment" className="icon-custom" />
        </Nav>
        <Nav className="ml-auto">
          {/* {usuario ? (<img src={usuario.foto} alt="perfil"/>) : (<img src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" alt="perfil"/>)} */}
          <img src="https://i.pinimg.com/222x/57/70/f0/5770f01a32c3c53e90ecda61483ccb08.jpg" alt="perfil" />
        </Nav>
        <Button style={{ backgroundColor: 'transparent', borderColor: 'green', color: 'green' }} onClick={handleLogout}>Cerrar Sesion</Button>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarCursos;
