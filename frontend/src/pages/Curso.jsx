import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Table, FormControl, InputGroup, Accordion, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { usuarios, cursos, sesiones, semanas } from '../data';

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
  RadialLinearScale,
} from "chart.js";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { cursoId } = location.state || {};
  const { loggedInUser } = useContext(AuthContext);
  const usuario = loggedInUser;
  const [key, setKey] = useState("home");
  const [participantes, setParticipantes] = useState([]);
  const [filteredParticipantes, setFilteredParticipantes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [asistencias, setAsistencias] = useState([]);
  const [participaciones, setParticipaciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState({ total: 0, presente: 0 });
  const [estadisticasParticipacion, setEstadisticasParticipacion] = useState({
    total: 0,
    participo: 0,
  });
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    // Encontrar el curso con el id proporcionado
    const selectedCurso = cursos.find((curso) => curso.codigo === cursoId);
    setCurso(selectedCurso);

    if (selectedCurso) {
      const participantesIds = selectedCurso.grupos.flatMap((grupo) => grupo.participantes);
      const participantesData = usuarios.filter((usuario) =>
        participantesIds.includes(usuario.codigo)
      );
      setParticipantes(participantesData);
      setFilteredParticipantes(participantesData);
    }
  }, [cursoId]);

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
    if (curso && usuario) {
      const semanasConSesiones = semanas.filter((semana) =>
        curso.grupos.some((grupo) => grupo.sesiones.some((sesion) => sesion._id === semana.id))
      );
      setAsistencias(asistencias); // Simula la carga de asistencias desde datos locales
      setParticipaciones(participaciones); // Simula la carga de participaciones desde datos locales

      let totalSesiones = 0;
      let sesionesPresentes = 0;
      let sesionesFalta = 0;
      let sesionesTardanzas = 0;
      let sesionesJustificados = 0;
      let sesionesParticipo = 0;

      semanasConSesiones.forEach((semana) => {
        semana.sesiones.forEach((sesion) => {
          totalSesiones++;

          const asistencia = asistencias.find((a) => a.tema === sesion.tema);
          const participacion = participaciones.find((p) => p.tema === sesion.tema);

          if (asistencia?.asistencia?.estado === "presente") {
            sesionesPresentes++;
          } else if (asistencia?.asistencia?.estado === "falta") {
            sesionesFalta++;
          } else if (asistencia?.asistencia?.estado === "tardanza") {
            sesionesTardanzas++;
          } else if (asistencia?.asistencia?.estado === "justificado") {
            sesionesJustificados++;
          }

          if (participacion) {
            sesionesParticipo++;
          }
        });
      });

      setEstadisticas({
        total: totalSesiones,
        presente: sesionesPresentes,
        falta: sesionesFalta,
        tardanza: sesionesTardanzas,
        justificado: sesionesJustificados,
      });
      setEstadisticasParticipacion({
        total: totalSesiones,
        participo: sesionesParticipo,
      });
    }
  }, [curso, usuario]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleSessionClick = (sessionId) => {
    if (sessionId) {
      navigate(`/asistencia/${sessionId}`);
    } else {
      console.error("Session ID is undefined or null.");
    }
  };

  const data = {
    labels: ["Presente", "Falta", "Justificado", "Tardanza", "No iniciada"],
    datasets: [
      {
        data: [
          estadisticas.presente,
          estadisticas.falta,
          estadisticas.tardanza,
          estadisticas.justificado,
          estadisticas.total - estadisticas.presente,
        ],
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#F23400",
          "#F27300",
          "#C9C9C9",
        ],
        hoverBackgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#BF2900",
          "#D02D00",
          "#A9A9A9",
        ],
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

  return (
    <>
      <div className="container-curso-seleccionado-total">
        <div className="nombre-curso">
          <h1>{curso.nombre}</h1>
        </div>
        <Tabs
          className="container-curso-seleccionado opciones-curso mb-3"
          defaultActiveKey="home"
          id="uncontrolled-tab-example"
        >
          <Tab eventKey="home" title="Home" style={{ height: "fit-content" }}>
            <div className="container-curso-seleccionado">
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>General</Accordion.Header>
                </Accordion.Item>
                {semanas.length > 0 ? (
                  semanas.map((semana, index) => (
                    <Accordion.Item key={index} eventKey={`${index}`}>
                      <Accordion.Header>Semana {index + 1}</Accordion.Header>
                      <Accordion.Body>
                        <ul>
                          {semana.sesiones.length > 0 ? (
                            semana.sesiones.map((sesion, idx) => (
                              <li key={idx}>
                                {usuario.role === "profesor" ? (
                                  <a style={{color: 'green', fontWeight: '700'}}
                                  href={`#/asistencia/${sesion._id}`} 
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleSessionClick(sesion._id);
                                  }}
                                >
                                  {sesion.tema}
                                </a>) : (<p>{sesion.tema}</p>)
                                }
                              </li>
                            ))
                          ) : (
                            <li>Sin sesiones</li>
                          )}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))
                ) : (
                  <div>No hay semanas disponibles</div>
                )}
              </Accordion>
            </div>
          </Tab>

          {usuario.role === 'profesor' || usuario.role === 'admin' ? ('') : (
            <Tab eventKey="estadisticas" title="Estadísticas">
              <Card>
                <Card.Header>
                  <Card.Title>Asistencias en sesiones</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Pie data={data} options={{ maintainAspectRatio: false }} />
                </Card.Body>
              </Card>

              <Card>
                <Card.Header>
                  <Card.Title>Participación en el curso</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Pie data={dataParticipacion} options={{ maintainAspectRatio: false }} />
                </Card.Body>
              </Card>
            </Tab>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default Curso;
