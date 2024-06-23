import React from 'react';
import { useLocation } from 'react-router-dom';
import NavbarCursos from './BarraNavegacionCurso';
import BarraNavegacion from './BarraNavegacion';

const Layout = ({ children }) => {
  const location = useLocation();

  return (
    <>
      {location.pathname.startsWith('/cursos') ? <NavbarCursos /> : <BarraNavegacion />}
      {children}
    </>
  );
};

export default Layout;