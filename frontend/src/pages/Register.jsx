import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    carrera: "",
    ciclo: "",
    codigo: "",
    correo: "",
    password: "",
    role: "alumno",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { nombre, carrera, ciclo, codigo, correo, password } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones adicionales pueden ser añadidas aquí
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/usuarios", formData);
      setLoading(false);
      setSuccess("Registrado exitosamente");
      setFormData({
        nombre: "",
        carrera: "",
        ciclo: "",
        codigo: "",
        correo: "",
        password: "",
        role: "alumno",
      });
      navigate('/')
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.msg || "Error al registrar, intente nuevamente"
      );
    }
  };

  return (
    <Container>
      <h2>Registro</h2>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex flex-row">
          <Col className="mx-1">
            <Form.Group as={Col} controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                name="nombre"
                value={nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formCarrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Select
                name="carrera"
                value={carrera}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Carrera</option>
                <option value="INFORMÁTICA">INFORMÁTICA</option>
                <option value="CIVIL">CIVIL</option>
                <option value="INDUSTRIAL">INDUSTRIAL</option>
                <option value="ELECTRÓNICA">ELECTRÓNICA</option>
                <option value="MECATRÓNICA">MECATRÓNICA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} controlId="formCiclo">
              <Form.Label>Ciclo</Form.Label>
              <Form.Select
                name="ciclo"
                value={ciclo}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Ciclo</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col className="mx-1">
            <Form.Group as={Col} controlId="formCodigo">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su código"
                name="correo"
                value={correo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group as={Col} controlId="formCodigo">
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
            <Form.Group as={Col} controlId="formPassword">
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
          </Col>
        </div>
        <Row className="mb-3"></Row>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </Button>
        <p className="mt-3">
          ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </p>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}
    </Container>
  );
};

export default Register;
