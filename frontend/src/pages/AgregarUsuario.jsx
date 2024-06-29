import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row, Container } from 'react-bootstrap';

const carrerasPorFacultad = {
  ingenieria: [
    "Informática",
    "Civil",
    "Industrial",
    "Electrónica",
    "Mecatrónica",
  ],
  derecho: ["Derecho"],
  arquitectura: ["Arquitectura"],
  cienciasEconomicas: [
    "Economía",
    "Administración de Empresas",
    "Contabilidad",
  ],
  psicologia: ["Psicología"],
  lenguasModernas: ["Traducción e Interpretación", "Idiomas Modernos"],
  medicina: ["Medicina"],
  biologiaHumana: ["Biología", "Biomedicina"],
};

const AgregarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [usuario, setUsuario] = useState({
    _id: '',
    codigo: '',
    nombre: '',
    facultad: '',
    carrera: '',
    ciclo: '',
    correo: '',
    role: '',
  });

  useEffect(() => {
    if (id) {
      obtenerUsuario(id);
    }
  }, [id]);

  const obtenerUsuario = async (valorId) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/usuarios/${valorId}`);
      if (res.data) {
        setUsuario({
          _id: valorId,
          codigo: res.data.codigo || '',
          nombre: res.data.nombre || '',
          facultad: res.data.facultad || '',
          carrera: res.data.carrera || '',
          ciclo: res.data.ciclo || '',
          correo: res.data.correo || '',
          role: res.data.role || '',
        });
      } else {
        console.error('No se encontraron datos para el usuario con id:', valorId);
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
  };

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      try {
        if (id) {
          await axios.put(`http://localhost:8080/api/usuarios/${id}`, usuario);
          alert('Usuario actualizado correctamente');
        } else {
          await axios.post('http://localhost:8080/api/usuarios', usuario);
          alert('Usuario creado correctamente');
        }
        navigate('/gestionar_usuario');
      } catch (error) {
        console.error('Error al guardar el usuario:', error);
        alert('Error al guardar el usuario');
      }
    }
  };

  return (
    <Container className="d-flex flex-column">
      <h2>{id ? 'Actualizar Usuario' : 'Crear Usuario'}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px' }}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="formCodigo">
            <Form.Label>Código</Form.Label>
            <Form.Control
              type="text"
              placeholder="Código del usuario"
              name="codigo"
              onChange={capturarDatos}
              value={usuario.codigo}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el código del usuario.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del usuario"
              name="nombre"
              onChange={capturarDatos}
              value={usuario.nombre}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese el nombre del usuario.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {usuario.role === 'alumno' && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formFacultad">
                <Form.Label>Facultad</Form.Label>
                <Form.Select
                  name="facultad"
                  value={usuario.facultad}
                  onChange={capturarDatos}
                  required
                >
                  <option value="">Seleccionar Facultad</option>
                  <option value="ingenieria">INGENIERÍA</option>
                  <option value="derecho">DERECHO</option>
                  <option value="arquitectura">ARQUITECTURA</option>
                  <option value="cienciasEconomicas">CIENCIAS ECONÓMICAS</option>
                  <option value="psicologia">PSICOLOGÍA</option>
                  <option value="lenguasModernas">LENGUAS MODERNAS</option>
                  <option value="medicina">MEDICINA</option>
                  <option value="biologiaHumana">BIOLOGÍA HUMANA</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="formCarrera">
                <Form.Label>Carrera</Form.Label>
                <Form.Select
                  name="carrera"
                  value={usuario.carrera}
                  onChange={capturarDatos}
                  required
                >
                  <option value="">Seleccionar Carrera</option>
                  {usuario.facultad && carrerasPorFacultad[usuario.facultad]?.map((carrera, index) => (
                    <option key={index} value={carrera}>
                      {carrera}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formCiclo">
                <Form.Label>Ciclo</Form.Label>
                <Form.Select
                  name="ciclo"
                  value={usuario.ciclo}
                  onChange={capturarDatos}
                  required
                >
                  <option value="">Seleccionar ciclo</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>
          </>
        )}

        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="formCorreo">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo del usuario"
              name="correo"
              onChange={capturarDatos}
              value={usuario.correo}
              required
            />
            <Form.Control.Feedback type="invalid">
              Por favor, ingrese un correo válido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              name="role"
              onChange={capturarDatos}
              value={usuario.role}
              required
            >
              <option value="">Seleccionar Rol</option>
              <option value="alumno">Alumno</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Admin</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Por favor, seleccione un rol.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Button type="submit">{id ? 'Actualizar' : 'Guardar'}</Button>
      </Form>
    </Container>
  );
};

export default AgregarUsuario;