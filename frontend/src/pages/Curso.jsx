import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Table,
  FormControl,
  InputGroup,
  Accordion,
  Card,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  RadialLinearScale
);

const Curso = () => {
  const location = useLocation();
  const { curso } = location.state || {};
  const loggedInUser = useContext(AuthContext);
  const [key, setKey] = useState("home");
  const [participantes, setParticipantes] = useState([]);
  const [filteredParticipantes, setFilteredParticipantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const usuario = loggedInUser;
  const [asistencias, setAsistencias] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, presente: 0 });
  const [estadisticasParticipacion, setEstadisticasParticipacion] = useState({
    total: 0,
    participo: 0,
  });

  useEffect(() => {
    if (curso) {
      const fetchParticipantes = async () => {
        try {
          const participantesIds = curso.grupos.flatMap(
            (grupo) => grupo.participantes
          );
          const participantesPromises = participantesIds.map((id) =>
            axios.get(`http://localhost:8080/api/usuarios/${id}`)
          );
          const participantesResponses = await Promise.all(
            participantesPromises
          );
          const participantesData = participantesResponses.map(
            (response) => response.data
          );
          setParticipantes(participantesData);
          setFilteredParticipantes(participantesData);
        } catch (error) {
          console.error("Error fetching participantes", error);
        }
      };

      fetchParticipantes();
    }
  }, [curso]);

  useEffect(() => {
    const results = participantes.filter(
      (participante) =>
        participante.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participante.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        participante.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredParticipantes(results);
  }, [searchTerm, participantes]);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const semanasIds = curso.grupos.flatMap(grupo => grupo.semanas);
        const semanasPromises = semanasIds.map(id => axios.get(`http://localhost:8080/api/semanas/${id}`));
        const semanasResponses = await Promise.all(semanasPromises);
        const semanasData = semanasResponses.map(response => response.data);

        let asistenciasData = [];
        let participacionesData = [];
        let sesionesData = [];
        let totalSesiones = 0;
        let sesionesPresentes = 0;
        let sesionesFalta = 0;
        let sesionesTardanzas = 0;
        let sesionesJustificados = 0;

        for (const semana of semanasData) {
          for (const sesionId of semana.sesiones) {
            totalSesiones++;
            const sesionResponse = await axios.get(`http://localhost:8080/api/sesiones/${sesionId}`);
            const sesion = sesionResponse.data;
            sesionesData.push(sesion);

            const asistencia = sesion.participantes.find(p => p.participante === usuario.loggedInUser.id)?.asistencia;
            const participacion = sesion.participantes.find(p => p.participante === usuario.loggedInUser.id)?.participacion;

            if (asistencia?.estado === "presente") {
              sesionesPresentes++;
            }

            if (asistencia?.estado === "falta") {
              sesionesFalta++;
            }

            if (asistencia?.estado === "tardanza") {
              sesionesTardanzas++;
            }
            
            if (asistencia?.estado === "justificado") {
              sesionesJustificados++;
            }

            asistenciasData.push({
              tema: sesion.tema,
              fecha: sesion.fecha,
              asistencia: asistencia || { estado: "No registrado", hora: null }
            });

            participacionesData.push({
              tema: sesion.tema,
              fecha: sesion.fecha,
              participacion: participacion || { comentario: "No registrado", fecha: null }
            });
          }
        }

        setAsistencias(asistenciasData);
        setParticipaciones(participacionesData);
        setEstadisticas({ total: totalSesiones, presente: sesionesPresentes, falta: sesionesFalta, tardanza: sesionesTardanzas, justificado: sesionesJustificados });
        setEstadisticasParticipacion({
          total: totalSesiones,
          participo: sesionesParticipo,
        });
      } catch (error) {
        console.error("Error fetching asistencias y participaciones", error);
      }
    };

    if (curso && loggedInUser) {
      fetchAsistencias();
    }
  }, [curso, loggedInUser]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const data = {
  labels: ['Presente', 'Falta', 'Justificado', 'Tardanza', 'No iniciada'],
  datasets: [
    {
      data: [estadisticas.presente, estadisticas.falta, estadisticas.tardanza, estadisticas.justificado],
      backgroundColor: ['#36A2EB', '#FF6384', '#F23400', '#F27300', '#C9C9C9'],
      hoverBackgroundColor: ['#36A2EB', '#FF6384', '#BF2900', '#D02D00', '#A9A9A9'],
    },
  ],
};

  const dataParticipacion = {
    labels: ["Participó", "No participó"],
    datasets: [
      {
        data: [
          estadisticasParticipacion.participo,
          estadisticasParticipacion.total - estadisticasParticipacion.participo,
        ],
        backgroundColor: ["#4BC0C0", "#FFCE56"],
        hoverBackgroundColor: ["#4BC0C0", "#FFCE56"],
      },
    ],
  };

  if (!curso) {
    return <div>Curso no encontrado</div>;
  }

  const semanas = [];
  curso.grupos.forEach((grupo) => {
    grupo.semanas.forEach((semanaId) => {
      semanas.push(semanaId);
    });
  });

  return (
    <>
      <div className="container-curso-seleccionado-total">
        <div className="nombre-curso">
          <h1>{curso.nombre}</h1>
        </div>
        <Tabs
          className="container-curso-seleccionado opciones-curso mb-3"
          defaultActiveKey="curso"
          id="uncontrolled-tab-example"
        >
          <Tab eventKey="curso" title="Curso" style={{ height: "fit-content" }}>
            <div className="container-curso-seleccionado">
              <div className="seccion">
                <FontAwesomeIcon icon="chevron-right" size="1x" />
                <h3>General</h3>
              </div>
              {/* <Accordion>
                {semanas.map((semanaId, index) => (
                  <Card key={semanaId}>
                    <Card.Header>
                      <Accordion.Toggle
                        as={Button}
                        variant="link"
                        eventKey={`${index}`}
                      >
                        Semana {index + 1}
                      </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey={`${index}`}>
                      <Card.Body>
                        <ul>
                          {curso.grupos
                            .flatMap((grupo) => grupo.sesiones)
                            .map((sesion, sesionIndex) => (
                              <li key={sesionIndex}>
                                {sesion.tema} -{" "}
                                {new Date(sesion.fecha).toLocaleDateString()}
                              </li>
                            ))}
                        </ul>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                ))}
              </Accordion> */}
            </div>
          </Tab>
          <Tab eventKey="participantes" title="Participantes">
            <div
              className="container-participantes"
              style={{ width: "1200px", overflowY: "auto", maxHeight: "1000px" }}
            >
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Buscar por nombre o código"
                  aria-label="Buscar"
                  aria-describedby="basic-addon1"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              {filteredParticipantes.length === 0 ? (
                <div>No hay participantes en este curso</div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Codigo</th>
                      <th>Nombre</th>
                      <th>Rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParticipantes.map((participante) => (
                      <tr key={participante._id}>
                        <td>{participante.codigo}</td>
                        <td>{participante.nombre}</td>
                        <td>{participante.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>
          <Tab
            eventKey="estadisticas"
            title="Estadísticas"
          >
            <div className="container-estadisticas" style={{ width: "600px", margin: "0 auto" }}>
              <Pie data={data} />
            </div>
          </Tab>
          <Tab
            eventKey="competencias"
            title="Competencias"
          ></Tab>
          <Tab
            eventKey="asistencias"
            title="Asistencias"
          >
            <div className="container-asistencias" style={{ width: "1200px", overflowY: "auto", maxHeight: "1000px" }}>
              {asistencias.length === 0 ? (
                <div>No hay asistencias registradas</div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tema</th>
                      <th>Fecha de Sesión</th>
                      <th>Estado</th>
                      <th>Fecha de Asistencia</th>
                      <th>Hora de Asistencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {asistencias.map((asistencia, index) => (
                      <tr key={index}>
                        <td>{asistencia.tema}</td>
                        <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                        <td>{asistencia.asistencia.estado}</td>
                        <td>{asistencia.asistencia.hora ? formatDate(asistencia.asistencia.hora) : 'N/A'}</td>
                        <td>{asistencia.asistencia.hora ? formatTime(asistencia.asistencia.hora) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>
          <Tab eventKey="participaciones" title="Participaciones">
            <div className="container-participaciones" style={{ width: "1200px", overflowY: "auto", maxHeight: "1000px" }}>
              {participaciones.length === 0 ? (
                <div>No hay participaciones registradas</div>
              ) : (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Tema</th>
                      <th>Fecha de Sesión</th>
                      <th>Comentario</th>
                      <th>Fecha de Participación</th>
                      <th>Hora de Participación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {participaciones.map((participacion, index) => (
                      <tr key={index}>
                        <td>{participacion.tema}</td>
                        <td>{new Date(participacion.fecha).toLocaleDateString()}</td>
                        <td>{participacion.participacion.comentario}</td>
                        <td>{participacion.participacion.fecha ? formatDate(participacion.participacion.fecha) : 'N/A'}</td>
                        <td>{participacion.participacion.fecha ? formatTime(participacion.participacion.fecha) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Curso;
