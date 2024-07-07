import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row, Container, Alert } from 'react-bootstrap';
import axios from 'axios';

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

function EditarCursoModal({ show, handleClose, curso, actualizarCursoEnLista }) {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    grado: '',
    carrera: '',
    facultad: '',
    ciclo: '',
    semestre: '',
    grupos: []
  });
  const [loading, setLoading] = useState(false);
  const [alumnosOptions, setAlumnosOptions] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/usuarios/");
        console.log(response.data);
        const filteredAlumnos = response.data.filter(
          (usuario) =>
            usuario.role === "alumno" &&
            usuario.ciclo == curso.ciclo &&
            usuario.carrera === curso.carrera
        );
        const options = filteredAlumnos.map((alumno) => ({
          value: `${alumno._id}`,
          label: `${alumno.nombre}`,
        }));
        setAlumnosOptions(options);
        console.log(alumnosOptions);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchAlumnos();
  }, [formData.semestre, formData.carrera, formData.ciclo]);

  useEffect(() => {
    if (curso) {
      setFormData({
        nombre: curso.nombre,
        codigo: curso.codigo,
        grado: curso.grado,
        carrera: curso.carrera,
        facultad: curso.facultad,
        ciclo: curso.ciclo,
        semestre: curso.semestre,
        grupos: curso.grupos
      });
    }
  }, [curso]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGroupChange = (index, field, value) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => 
      idx === index ? { ...grupo, [field]: value } : grupo
    );
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleAddGroup = () => {
    setFormData({
      ...formData,
      grupos: [...formData.grupos, { tipoGrupo: '', horario: [], participantes: [], sesiones: [] }]
    });
  };

  const handleRemoveGroup = (index) => {
    const updatedGrupos = formData.grupos.filter((_, idx) => idx !== index);
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleSessionChange = (groupIndex, sessionIndex, field, value) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        const updatedHorario = grupo.horario.map((sesion, sIdx) =>
          sIdx === sessionIndex ? { ...sesion, [field]: value } : sesion
        );
        return { ...grupo, horario: updatedHorario };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleParticipantChange = (groupIndex, participantIndex, value) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        const updatedParticipantes = grupo.participantes.map((part, pIdx) =>
          pIdx === participantIndex ? value : part
        );
        return { ...grupo, participantes: updatedParticipantes };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const addSession = (groupIndex) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        return { ...grupo, horario: [...grupo.horario, { dia: '', hora: '' }] };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const removeSession = (groupIndex, sessionIndex) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        const updatedHorario = grupo.horario.filter((_, sIdx) => sIdx !== sessionIndex);
        return { ...grupo, horario: updatedHorario };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const addParticipant = (groupIndex) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        return { ...grupo, participantes: [...grupo.participantes, ''] };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const removeParticipant = (groupIndex, participantIndex) => {
    const updatedGrupos = formData.grupos.map((grupo, idx) => {
      if (idx === groupIndex) {
        const updatedParticipantes = grupo.participantes.filter((_, pIdx) => pIdx !== participantIndex);
        return { ...grupo, participantes: updatedParticipantes };
      }
      return grupo;
    });
    setFormData({ ...formData, grupos: updatedGrupos });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8080/api/cursos/${curso._id}`, formData);
      actualizarCursoEnLista(res.data);
      setSuccess("Curso actualizado con éxito");
      setError(null);
      setTimeout(() => {
        setSuccess(null);
        handleClose();
      }, 2000);
    } catch (error) {
      setError("Error al actualizar el curso");
      setSuccess(null);
    }
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} size='lg'>
      <Modal.Header closeButton>
        <Modal.Title>Editar Curso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="d-flex flex-column">
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
                  <Form.Control
                    as="select"
                    name="semestre"
                    value={formData.semestre}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un semestre</option>
                    <option value="2024-I">2024-I</option>
                    <option value="2024-II">2024-II</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                {/* Grupos */}
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
                                handleGroupChange(index, 'tipoGrupo', e.target.value)
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
                              onClick={() => handleRemoveGroup(index)}
                            >
                              Eliminar
                            </Button>
                          </Col>
                        </Row>

                        {/* Horario */}
                        <Form.Group controlId={`formHorario-${index}`}>
                          <Form.Label>Horario</Form.Label>
                          {grupo.horario.map((sesion, sesionIndex) => (
                            <Row key={sesionIndex} className="mb-2">
                              <Col>
                                <Form.Select
                                  name="dia"
                                  value={sesion.dia}
                                  onChange={(e) =>
                                    handleSessionChange(index, sesionIndex, "dia", e.target.value)
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
                                    handleSessionChange(index, sesionIndex, "hora", e.target.value)
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

                        {/* Participantes */}
                        <Form.Group
                          controlId={`formParticipantes-${index}`}
                          className="mt-3"
                        >
                          <Form.Label>Participantes</Form.Label>
                          {grupo.participantes.map(
                            (participante, participanteIndex) => (
                              <Row key={participanteIndex} className="mb-2">
                                <Col>
                                  <Form.Select
                                    name="participante"
                                    value={participante}
                                    onChange={(e) =>
                                      handleParticipantChange(index, participanteIndex, e.target.value)
                                    }
                                  >
                                    <option value="">Agregar participante</option>
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
                                    onClick={() => removeParticipant(index, participanteIndex)}
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
                    onClick={handleAddGroup}
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
              {loading ? "Actualizando..." : "Actualizar Curso"}
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
      </Modal.Body>
    </Modal>
  );
}

export default EditarCursoModal;
