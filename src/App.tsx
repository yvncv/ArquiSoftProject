import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import GestionarSesion from './pages/GestionarSesion';
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
        <Layout loggedInUser={loggedInUser}>
          <Routes>
            {/* Estas rutas ahora son accesibles por todos, independientemente de la autenticación */}
            <Route path="/" element={<Cursos />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/cursos' element={<Cursos />} />
            <Route path="/curso/:nombre" element={<Curso />} /> {/* Esta es la única ruta para /curso/:nombre */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/agregar_usuario" element={<AgregarUsuario />} />
            <Route path="/agregar_usuario/:id" element={<AgregarUsuario />} />
            <Route path="/gestionar_usuarios" element={<GestionarUsuario />} />
            <Route path="/gestionar_cursos" element={<GestionarCursos />} />
            <Route path="/crear_curso" element={<CrearCurso />} />
            <Route path="/asistencia/:id" element={<GestionarSesion />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
