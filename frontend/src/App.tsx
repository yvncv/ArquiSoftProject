import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from './types/DecodedToken';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import BarraNavegacion from './components/BarraNavegacion';
import Cursos from './pages/Cursos';
import Profile from './pages/Profile';
import CrearCurso from './pages/CrearCurso';

function App() {
  const [loggedInUser, setLoggedInUser] = useState<DecodedToken['usuario'] | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        return decoded.usuario;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return null;
      }
    }
    return null;
  });

  return (
    <AuthProvider>
      <Router>
        <>
        <BarraNavegacion loggedInUser={loggedInUser} />
          <div className='container'>
            <Routes>
              <Route path="/" element={<Login setLoggedInUser={setLoggedInUser} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={ loggedInUser ? <Dashboard /> : <Navigate to="/" />} />
              <Route path='/cursos' element={<Cursos/>}/>
              <Route path="/profile" element={ loggedInUser ? <Profile /> : <Navigate to="/" />} />
              <Route path="/crear_curso" element={ loggedInUser?.role==="admin" ? <CrearCurso /> : <Navigate to="/dashboard" />} />
            </Routes>
          </div>
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;