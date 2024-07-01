import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './types/DecodedToken';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Layout from './components/Layout.jsx';
import Profile from './pages/Profile';
import CrearCurso from './pages/CrearCurso';
import GestionarUsuario from './pages/GestionarUsuario';
import AgregarUsuario from './pages/AgregarUsuario';
import GestionarCursos from './pages/GestionarCursos';
import Curso from './pages/Curso';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<DecodedToken['usuario'] | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setLoggedInUser(decoded.usuario);
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setLoggedInUser(null);
      }
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <>
          <Layout loggedInUser={loggedInUser}>
            <Routes>
              <Route path="/" element={loggedInUser ? <Cursos /> : <Login setLoggedInUser={setLoggedInUser} />} />
              <Route path="/dashboard" element={loggedInUser ? <Dashboard /> : <Navigate to="/" />} />
              <Route path='/cursos' element={<Cursos />} />
              <Route path="/profile" element={loggedInUser ? <Profile /> : <Navigate to="/" />} />
              <Route path="/agregar_usuario" element={loggedInUser ? <AgregarUsuario /> : <Navigate to="/" />} />
              <Route path="/agregar_usuario/:id" element={loggedInUser ? <AgregarUsuario /> : <Navigate to="/" />} /> {/* Ruta para editar usuario */}
              <Route path="/gestionar_usuarios" element={loggedInUser?.role === "admin" ? <GestionarUsuario /> : <Dashboard />} />
              <Route path="/gestionar_cursos" element={loggedInUser?.role === "admin" ? <GestionarCursos /> : <Dashboard />} />
              <Route path="/curso/:nombre" element={<Curso />} />
              <Route path="/crear_curso" element={loggedInUser?.role === "admin" ? <CrearCurso /> : <Dashboard />} />
            </Routes>
          </Layout>
        </>
        {loggedInUser?.role !== "admin" && (
          <footer className="footer-cursos">
            <div className="footer-cursos-texto">
              <h4>
                MANUAL DE USUARIO - AULA VIRTUAL DOCENTES
              </h4>
              <h4>
                MANUAL DE USUARIO - AULA VIRTUAL ALUMNOS
              </h4>
              <h4>
                MANUAL DE USUARIO - ZOOM DOCENTES
              </h4>
              <h4>
                MANUAL DE USUARIO - ZOOM ALUMNOS
              </h4>
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
              <FontAwesomeIcon icon={['fab', 'linkedin']} size="2x" />
            </div>
          </footer>
        )}
      </Router>
    </AuthProvider>
  );
}

export default App;