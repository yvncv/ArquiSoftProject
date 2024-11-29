import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
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

const CrearCurso = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    codigo: "",
    grado: "",
    carrera: "",
    facultad: "",
    ciclo: "",
    semestre: "",
    grupos: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [alumnosOptions, setAlumnosOptions] = useState([]);
  const [profesoresOptions, setProfesoresOptions] = useState([]);

  if (!Array.isArray(formData.grupos)) {
    formData.grupos = [];
  }

  useEffect(() => {
    const fetchAlumnosYProfesores = () => {
      // Filtrando alumnos y profesores a partir de los datos en data.js
      const filteredAlumnos = usuarios.filter(
        (usuario) =>
          usuario.role === "alumno" &&
          usuario.ciclo === formData.ciclo &&
          usuario.carrera === formData.carrera
      );
      const filteredProfesores = usuarios.filter(
        (usuario) =>
          usuario.role === "profesor" && usuario.facultad === formData.facultad
      );

      const alumnosOptions = filteredAlumnos.map((alumno) => ({
        value: `${alumno._id}`,
        label: `${alumno.nombre}`,
      }));
      const profesoresOptions = filteredProfesores.map((profesor) => ({
        value: `${profesor._id}`,
        label: `${profesor.nombre}`,
      }));

      setAlumnosOptions(alumnosOptions);
      setProfesoresOptions(profesoresOptions);
    };

    fetchAlumnosYProfesores();
  }, [formData.semestre, formData.carrera, formData.ciclo, formData.facultad]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSessionChange = (grupoIndex, sesionIndex, field, value) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].horario[sesionIndex][field] = value;
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleParticipantChange = (grupoIndex, participanteIndex, value) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].participantes[participanteIndex] = value;
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleGrupoChange = (index, value) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[index] = {
      tipoGrupo: value,
      horario: [],
      participantes: [{ tipo: "profesor", value: "" }],
    };
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const removeGrupo = (index) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos.splice(index, 1);
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const addGrupo = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      grupos: [
        ...prevFormData.grupos,
        {
          tipoGrupo: "",
          horario: [],
          participantes: [{ tipo: "profesor", value: "" }],
        },
      ],
    }));
  };

  const addSession = (grupoIndex) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].horario.push({ dia: "", hora: "" });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const removeSession = (grupoIndex, sesionIndex) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].horario.splice(sesionIndex, 1);
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const addParticipant = (grupoIndex) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].participantes.push({ tipo: "alumno", value: "" });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const removeParticipant = (grupoIndex, participanteIndex) => {
    const updatedGrupos = [...formData.grupos];
    updatedGrupos[grupoIndex].participantes.splice(participanteIndex, 1);
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
      };

      // Aquí puedes manejar la creación del curso, simular la creación, o enviar a un servidor
      setLoading(false);
      setSuccess("Curso creado exitosamente");

      setFormData({
        nombre: "",
        codigo: "",
        grado: "",
        facultad: "",
        carrera: "",
        ciclo: "",
        semestre: "",
        grupos: [],
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
    <Container className="d-flex flex-column">
      <h2>Crear curso</h2>
      <Form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "15px",
        }}
      >
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
            <Form.Group controlId="formCarrera">
              <Form.Label>Carrera</Form.Label>
              <Form.Select
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar Carrera</option>
                {formData.facultad &&
                  carrerasPorFacultad[formData.facultad]?.map(
                    (carrera, index) => (
                      <option key={index} value={carrera}>
                        {carrera}
                      </option>
                    )
                  )}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formCiclo">
              <Form.Label>Ciclo</Form.Label>
              <Form.Select
                name="ciclo"
                value={formData.ciclo}
                onChange={handleChange}
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
            <Form.Group controlId="formSemestre">
              <Form.Label>Semestre</Form.Label>
              <Form.Select
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione un semestre</option>
                <option value="2024-I">2024-I</option>
                <option value="2024-II">2024-II</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formGrupos">
              <Form.Label style={{ margin: "20px" }}>Grupos</Form.Label>
              <div
                style={{
                  maxHeight: "350px",
                  overflowY: "auto",
                  border: "1px solid #ccc",
                  padding: "10px",
                }}
              >
                {formData.grupos.map((grupo, index) => (
                  <div
                    key={index}
                    style={{
                      border: "1px solid #ccc",
                      padding: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    <h4>Grupo {index + 1}</h4>
                    <Row className="mb-2">
                      <Col>
                        <Form.Select
                          name="tipoGrupo"
                          value={grupo.tipoGrupo}
                          onChange={(e) =>
                            handleGrupoChange(index, e.target.value)
                          }
                          required
                        >
                          <option value="">Seleccionar tipo de grupo</option>
                          <option value="Teoría">Teoría</option>
                          <option value="Taller">Taller</option>
                          <option value="Laboratorio">Laboratorio</option>
                        </Form.Select>
                      </Col>
                      <Col xs="auto">
                        <Button
                          variant="outline-danger"
                          onClick={() => removeGrupo(index)}
                        >
                          Eliminar
                        </Button>
                      </Col>
                    </Row>
                    <Form.Group controlId={`formHorario-${index}`}>
                      <Form.Label>Horario</Form.Label>
                      {grupo.horario.map((sesion, sesionIndex) => (
                        <Row key={sesionIndex} className="mb-2">
                          <Col>
                            <Form.Select
                              name="dia"
                              value={sesion.dia}
                              onChange={(e) =>
                                handleSessionChange(
                                  index,
                                  sesionIndex,
                                  "dia",
                                  e.target.value
                                )
                              }
                              required
                            >
                              <option value="">
                                Seleccionar día de semana
                              </option>
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
                              onChange={(e) =>
                                handleSessionChange(
                                  index,
                                  sesionIndex,
                                  "hora",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </Col>
                          <Col xs="auto">
                            <Button
                              variant="danger"
                              onClick={() => removeSession(index, sesionIndex)}
                            >
                              &times;
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Button
                        style={{ margin: "10px" }}
                        variant="secondary"
                        onClick={() => addSession(index)}
                      >
                        Agregar Horario
                      </Button>
                    </Form.Group>

                    <Form.Group
                      controlId={`formParticipantes-${index}`}
                      className="mt-3"
                    >
                      <Form.Label>Profesor</Form.Label>
                      <Row className="mb-2">
                        <Col>
                          <Form.Select
                            name="profesor"
                            value={grupo.participantes[0].value}
                            onChange={(e) =>
                              handleParticipantChange(
                                index,
                                0,
                                e.target.value
                              )
                            }
                            required
                          >
                            <option value="">Seleccionar Profesor</option>
                            {profesoresOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>
                      </Row>
                      <Form.Label>Participantes</Form.Label>
                      {grupo.participantes.slice(1).map(
                        (participante, participanteIndex) => (
                          <Row key={participanteIndex + 1} className="mb-2">
                            <Col>
                              <Form.Select
                                name="participante"
                                value={participante.value}
                                onChange={(e) =>
                                  handleParticipantChange(
                                    index,
                                    participanteIndex + 1,
                                    e.target.value
                                  )
                                }
                                required
                              >
                                <option value="">
                                  Agregar participante
                                </option>
                                {alumnosOptions.map((option) => (
                                  <option
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </option>
                                ))}
                              </Form.Select>
                            </Col>
                            <Col xs="auto">
                              <Button
                                variant="danger"
                                onClick={() =>
                                  removeParticipant(index, participanteIndex + 1)
                                }
                              >
                                &times;
                              </Button>
                            </Col>
                          </Row>
                        )
                      )}
                      <Button
                        style={{ margin: "10px" }}
                        variant="secondary"
                        onClick={() => addParticipant(index)}
                      >
                        Agregar Participante
                      </Button>
                    </Form.Group>
                  </div>
                ))}
              </div>
              <Button
                style={{ margin: "10px" }}
                variant="secondary"
                onClick={addGrupo}
              >
                Agregar Grupo
              </Button>
            </Form.Group>
          </Col>
        </Row>
        <Button
          className="boton-crear-curso"
          variant="primary"
          type="submit"
          disabled={loading}
        >
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
