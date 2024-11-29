import React, { useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { usuarios, cursos, sesiones, semanas } from '../data';

const Login = ({ setLoggedInUser }) => {
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

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Activar el estado de carga

    // Simulamos la verificación de usuario con los datos de usuarios
    const usuario = usuarios.find(u => u.codigo === codigo && u.password === password); 

    if (usuario) {
      setLoggedInUser(usuario);
      localStorage.setItem('token', 'simulated-token'); // Simulamos un token
      console.log('Usuario logueado:', usuario);
      navigate('/cursos'); // Redirige al usuario al dashboard
    } else {
      setError('Credenciales incorrectas');
    }

    setLoading(false); // Desactivar el estado de carga cuando finaliza la verificación
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
