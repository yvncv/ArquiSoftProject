import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import axios from "axios";

const CrearCurso = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    grado: "",
    carrera: "",
    facultad: "",
    semestre: "",
    sesiones: [{ dia: "", hora: "" }],
    participantes: [] // Cambiado a un array vacío
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [alumnosOptions, setAlumnosOptions] = useState([]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/usuarios/");
        const filteredAlumnos = response.data.filter(
          (usuario) =>
            usuario.role === "alumno" &&
            usuario.ciclo === formData.semestre &&
            usuario.carrera === formData.carrera
        );
        const options = filteredAlumnos.map((alumno) => ({
          value: `${alumno._id}`,
          label: `${alumno.nombre}`,
        }));
        setAlumnosOptions(options);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchAlumnos();
  }, [formData.semestre, formData.carrera]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSessionChange = (index, field, value) => {
    const updatedSessions = [...formData.sesiones];
    updatedSessions[index][field] = value;
    setFormData({ ...formData, sesiones: updatedSessions });
  };

  const handleParticipantChange = (index, value) => {
    const updatedParticipants = [...formData.participantes];
    updatedParticipants[index] = value; // Aquí `value` es el ID del participante seleccionado
    setFormData({ ...formData, participantes: updatedParticipants });
  };

  const addSession = () => {
    setFormData({
      ...formData,
      sesiones: [...formData.sesiones, { dia: "", hora: "" }]
    });
  };

  const removeSession = (index) => {
    const updatedSessions = formData.sesiones.filter((_, i) => i !== index);
    setFormData({ ...formData, sesiones: updatedSessions });
  };

  const addParticipant = () => {
    setFormData({
      ...formData,
      participantes: [...formData.participantes, { _id: "", nombre: "" }]
    });
  };
  
  const removeParticipant = (index) => {
    const updatedParticipants = [...formData.participantes];
    updatedParticipants.splice(index, 1);
    setFormData({ ...formData, participantes: updatedParticipants });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    
    try {
      // Construir objeto de datos para enviar al backend
      const dataToSend = {
        ...formData,
        participantes: formData.participantes // Ya contiene solo IDs
      };
      
      await axios.post("http://localhost:8080/api/cursos", dataToSend);
      setLoading(false);
      setSuccess("Curso creado exitosamente");
      
      // Limpiar solo los campos necesarios en formData
      setFormData({
        ...formData,
        nombre: "",
        codigo: "",
        grado: "",
        facultad: "",
        sesiones: [{ dia: "", hora: "" }]
      });
    } catch (error) {
      setLoading(false);
      setError(
        error.response?.data?.message ||
          "Error al crear el curso, intente nuevamente"
      );
    }
  };

  return (
    <Container>
      <h2>Crear curso</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese nombre del curso"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formCodigo">
              <Form.Label>Código del curso</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese código del curso"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formGrado">
              <Form.Label>Grado del curso</Form.Label>
              <Form.Select
                name="grado"
                value={formData.grado}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Grado</option>
                <option value="pregrado">Pregrado</option>
                <option value="posgrado">Posgrado</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formFacultad">
              <Form.Label>Facultad</Form.Label>
              <Form.Select
                name="facultad"
                value={formData.facultad}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Facultad</option>
                <option value="INGENIERÍA">INGENIERÍA</option>
                <option value="DERECHO">DERECHO</option>
                <option value="ARQUITECTURA">ARQUITECTURA</option>
                <option value="ECONOMÍA">ECONOMÍA</option>
                <option value="HOTELERÍA">HOTELERÍA Y TURISMO</option>
                <option value="PSICOLOGÍA">PSICOLOGÍA</option>
                <option value="LENGUAS">LENGUAS MODERNAS</option>
                <option value="BIOLOGÍA">BIOLOGÍA</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formCarrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Select
                name="carrera"
                value={formData.carrera}
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
            <Form.Group controlId="formSemestre">
              <Form.Label>Semestre</Form.Label>
              <Form.Select
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Semestre</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formSesiones">
              <Form.Label>Sesiones</Form.Label>
              {formData.sesiones.map((sesion, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Select
                      name="dia"
                      value={sesion.dia}
                      onChange={(e) => handleSessionChange(index, "dia", e.target.value)}
                      required
                    >
                      <option value="">Seleccionar día de semana</option>
                      <option value="Lunes">Lunes</option>
                      <option value="Martes">Martes</option>
                      <option value="Miércoles">Miércoles</option>
                      <option value="Jueves">Jueves</option>
                      <option value="Viernes">Viernes</option>
                      <option value="Sábado">Sábado</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      type="time"
                      name="hora"
                      value={sesion.hora}
                      onChange={(e) => handleSessionChange(index, "hora", e.target.value)}
                      required
                    />
                  </Col>
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => removeSession(index)}>&times;</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addSession}>Agregar Sesión</Button>
            </Form.Group>
            <Form.Group controlId="formParticipantes">
              <Form.Label>Participantes</Form.Label>
              {formData.participantes.map((participante, index) => (
                <Row key={index} className="mb-2">
                  <Col>
                    <Form.Select
                      name="participante"
                      value={participante._id} // Assuming participante is an object with _id
                      onChange={(e) => handleParticipantChange(index, e.target.value)}
                      required
                    >
                      <option value="">Agregar participante</option>
                      {alumnosOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col xs="auto">
                    <Button variant="danger" onClick={() => removeParticipant(index)}>&times;</Button>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" onClick={addParticipant}>Agregar Participante</Button>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Crear Curso"}
        </Button>
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

export default CrearCurso;
