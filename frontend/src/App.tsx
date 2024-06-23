import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './types/DecodedToken';
import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Cursos from './pages/Cursos';
import Layout from './components/Layout';
import Profile from './pages/Profile';
import CrearCurso from './pages/CrearCurso';
import GestionarUsuario from './pages/GestionarUsuario';
import AgregarUsuario from './pages/AgregarUsuario';
import GestionarCursos from './pages/GestionarCursos';

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
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={loggedInUser ? <Dashboard /> : <Navigate to="/" />} />
              <Route path='/cursos' element={<Cursos />} />
              <Route path="/profile" element={loggedInUser ? <Profile /> : <Navigate to="/" />} />
              <Route path="/agregar_usuario" element={loggedInUser ? <AgregarUsuario /> : <Navigate to="/" />} />
              <Route path="/agregar_usuario/:id" element={loggedInUser ? <AgregarUsuario /> : <Navigate to="/" />} /> {/* Ruta para editar usuario */}
              <Route path="/gestionar_usuarios" element={loggedInUser?.role === "admin" ? <GestionarUsuario /> : <Dashboard />} />
              <Route path="/gestionar_cursos" element={loggedInUser?.role === "admin" ? <GestionarCursos /> : <Dashboard />} />
              <Route path="/crear_curso" element={loggedInUser?.role === "admin" ? <CrearCurso /> : <Dashboard />} />
            </Routes>
          </Layout>
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;