import React, { useContext, useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = ({ setLoggedInUser }) => {
  const { login } = useContext(AuthContext);
  const [codigo, setCodigo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'codigo') {
      setCodigo(e.target.value);
    } else if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Activar el estado de carga
  
    try {
      const res = await axios.post('http://localhost:8080/api/usuarios/login', { codigo, password });
      localStorage.setItem('token', res.data.token);
      const {token} = res.data;
      // Hacer una solicitud GET para obtener los datos del usuario
      const userDataRes = await axios.get(`http://localhost:8080/api/usuarios/login/${token}`);
      setLoggedInUser(userDataRes.data);
      login(userDataRes.data.usuario);
      
      console.log('Usuario logueado:', userDataRes.data);
      navigate('/cursos'); // Redirige al usuario al dashboard
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(error.response.data.msg);
        } else if (error.request) {
          setError('No se recibió respuesta del servidor.');
        } else {
          setError('Error al iniciar sesión.');
        }
      }
    } finally {
      setLoading(false); // Desactivar el estado de carga cuando finaliza la solicitud
    }
  };
  

  return (
    <Container className='login'>
      <div className='container-formulario-logo'>
        <div className='logo'></div>
      </div>
      {loading ? ( // Mostrar mensaje de carga si se está cargando
        <p>Cargando...</p>
      ) : (
        <Form onSubmit={handleSubmit} className="container-formulario">
            <Form.Group as={Col} md="6" controlId="formCodigo">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su código"
                name="codigo"
                value={codigo}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group as={Col} md="6" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingrese su contraseña"
                name="password"
                value={password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          <Button variant="success" type="submit">
            Iniciar Sesión
          </Button>
          <p className="mt-3">¿No tienes una cuenta? <Link to="/">Solicita aquí</Link></p>
        </Form>
      )}
      {error && <p>{error}</p>}
    </Container>
  );
};

export default Login;