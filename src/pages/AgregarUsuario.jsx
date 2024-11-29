import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Col, Form, Row, Container } from 'react-bootstrap';
import { usuarios, cursos, sesiones, semanas } from '../data';

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

  // Obtener el usuario desde los datos simulados
  const obtenerUsuario = (valorId) => {
    const usuarioEncontrado = usuarios.find((usuario) => usuario._id === valorId);
    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
    } else {
      console.error('No se encontraron datos para el usuario con id:', valorId);
    }
  };

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setUsuario({ ...usuario, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setValidated(true);

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (id) {
        // Actualizar el usuario en el array
        const updatedUsers = usuarios.map((u) => (u._id === usuario._id ? usuario : u));
        console.log('Usuario actualizado', updatedUsers);
        alert('Usuario actualizado correctamente');
      } else {
        // Crear un nuevo usuario
        const newUser = { ...usuario, _id: `${Date.now()}` };  // Generando un ID único temporal
        usuarios.push(newUser);
        console.log('Nuevo usuario creado', usuarios);
        alert('Usuario creado correctamente');
      }
      navigate('/gestionar_usuario');
    }
  };

  return (
    <Container className="d-flex flex-column bg-gradient-to-r from-[#ffffff] to-[#a8dadc] p-6 rounded-xl">
      <h2 className="text-[#1a202c]">{id ? 'Actualizar Usuario' : 'Crear Usuario'}</h2>
      <Form noValidate validated={validated} onSubmit={handleSubmit} style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px' }}>
        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="formCodigo">
            <Form.Label className="text-[#1a202c]">Código</Form.Label>
            <Form.Control
              type="text"
              placeholder="Código del usuario"
              name="codigo"
              onChange={capturarDatos}
              value={usuario.codigo}
              required
              className="border-[#00d4ff]"
            />
            <Form.Control.Feedback type="invalid" className="text-[#e02cbf]">
              Por favor, ingrese el código del usuario.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="formNombre">
            <Form.Label className="text-[#1a202c]">Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del usuario"
              name="nombre"
              onChange={capturarDatos}
              value={usuario.nombre}
              required
              className="border-[#00d4ff]"
            />
            <Form.Control.Feedback type="invalid" className="text-[#e02cbf]">
              Por favor, ingrese el nombre del usuario.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {(usuario.role === 'alumno' || usuario.role ==='profesor') && (
          <>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formFacultad">
                <Form.Label className="text-[#1a202c]">Facultad</Form.Label>
                <Form.Select
                  name="facultad"
                  value={usuario.facultad}
                  onChange={capturarDatos}
                  required={usuario.role === "alumno"}
                  className="border-[#00d4ff]"
                >
                  <option value="">Seleccionar Facultad</option>
                  <option value="ingenieria">INGENIERÍA</option>
                  <option value="derecho">DERECHO</option>
                  <option value="arquitectura">ARQUITECTURA</option>
                  <option value="cienciasEconomicas">CIENCIAS ECONÓMICAS</option>
                  <option value="psicologia">PSICÓLOGÍA</option>
                  <option value="lenguasModernas">LENGUAS MODERNAS</option>
                  <option value="medicina">MEDICINA</option>
                  <option value="biologiaHumana">BIOLOGÍA HUMANA</option>
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} md="6" controlId="formCarrera">
                <Form.Label className="text-[#1a202c]">Carrera</Form.Label>
                <Form.Select
                  name="carrera"
                  value={usuario.carrera}
                  onChange={capturarDatos}
                  required={usuario.role === "alumno"}
                  className="border-[#00d4ff]"
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
                <Form.Label className="text-[#1a202c]">Ciclo</Form.Label>
                <Form.Select
                  name="ciclo"
                  value={usuario.ciclo}
                  onChange={capturarDatos}
                  required={usuario.role === "alumno"}
                  className="border-[#00d4ff]"
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
            <Form.Label className="text-[#1a202c]">Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Correo del usuario"
              name="correo"
              onChange={capturarDatos}
              value={usuario.correo}
              required
              className="border-[#00d4ff]"
            />
            <Form.Control.Feedback type="invalid" className="text-[#e02cbf]">
              Por favor, ingrese un correo válido.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="formRol">
            <Form.Label className="text-[#1a202c]">Rol</Form.Label>
            <Form.Control
              as="select"
              name="role"
              onChange={capturarDatos}
              value={usuario.role}
              required
              className="border-[#00d4ff]"
            >
              <option value="">Seleccionar Rol</option>
              <option value="alumno">Alumno</option>
              <option value="profesor">Profesor</option>
              <option value="admin">Admin</option>
            </Form.Control>
            <Form.Control.Feedback type="invalid" className="text-[#e02cbf]">
              Por favor, seleccione un rol.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Button className="bg-[#00d4ff] text-white" type="submit">{id ? 'Actualizar' : 'Guardar'}</Button>
      </Form>
    </Container>
  );
};

export default AgregarUsuario;
