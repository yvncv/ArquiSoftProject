import React from 'react';
import NavbarCursos from './BarraNavegacionCurso';
import "../Navbarcursos.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Layout = ({ loggedInUser, children }) => {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* {loggedInUser ? <NavbarCursos /> : ''} */}
      <NavbarCursos />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {loggedInUser?.role !== "admin" && (
        <footer className="footer-cursos" style={{ backgroundColor: '#333', color: 'white', padding: '20px', marginBottom: '0', width: '100%' }}>
          <div className="footer-cursos-texto">
            <a href="https://www.urp.edu.pe/pdf/id/51415/n/manual-de-usuario-aula-virtual-docentes.pdf" target="_blank" rel="noreferrer noopener">
              <h4 style={{ color: 'white' }}>MANUAL DE USUARIO - AULA VIRTUAL DOCENTES</h4>
            </a>
            <a href="https://www.urp.edu.pe/pdf/id/51414/n/manual-de-usuario-aula-virtual.pdf" target="_blank" rel="noreferrer noopener">
              <h4 style={{ color: 'white' }}>MANUAL DE USUARIO - AULA VIRTUAL ALUMNOS</h4>
            </a>
            <a href="https://www.urp.edu.pe/pdf/id/51417/n/manual-de-usuario-zoom-docentes.pdf" target="_blank" rel="noreferrer noopener" style={{ fontWeight: 'bold' }}>
              <h4 style={{ color: 'white' }}>MANUAL DE USUARIO - ZOOM DOCENTES</h4>
            </a>
            <a href="https://www.urp.edu.pe/pdf/id/51416/n/manual-de-usuario-zoom-alumnos.pdf" target="_blank" rel="noreferrer noopener">
              <h4 style={{ color: 'white' }}>MANUAL DE USUARIO - ZOOM ALUMNOS</h4>
            </a>
            <p>
              Av. Benavides 5440 - Santiago de Surco Lima 33 Perú | Apartado postal 1801 | ( 0511 ) 708 0000
            </p>
            <p>
              correo: helpdesk@urp.edu.pe
            </p>
          </div>
          <div className="footer-cursos-iconos">
            <FontAwesomeIcon icon={['fab', 'facebook']} size="2x" />
            <FontAwesomeIcon icon={['fab', 'twitter']} size="2x" />
            <FontAwesomeIcon icon={['fab', 'youtube']} size="2x" />
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
