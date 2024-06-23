import React from 'react';
import NavbarCursos from './BarraNavegacionCurso';
import "../Navbarcursos.css"; // Puedes usar esto para estilos personalizados

const Layout = ({ loggedInUser, children }) => {

  return (
    <>
      {loggedInUser ? <NavbarCursos /> : ''}
      {children}
    </>
  );
};

export default Layout;