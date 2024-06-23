import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../Navbarcursos.css"; // Puedes usar esto para estilos personalizados

const NavbarCursos = () => {
  return (
    <Navbar expand="lg" className="navbar-cursos mb-3">
      <Navbar.Brand href="" className="logo-con-texto"></Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-cursos-nav" />
      <Navbar.Collapse id="navbar-cursos-nav">
        <Nav className="ml-auto">
          <Nav.Link as={Link} to="/cursos">
            PÁGINA PRINCIPAL
          </Nav.Link>
          <Nav.Link as={Link} to="/cursos">
            ÁREA PERSONAL
          </Nav.Link>
          <Nav.Link as={Link} to="/cursos">
            MIS CURSOS
          </Nav.Link>
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
          <img src="/foto-perfil.jpeg" alt="perfil"/>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarCursos;
