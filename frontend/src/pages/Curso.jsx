import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "react-bootstrap";
import { Pie } from "react-chartjs-2";
import { Table, FormControl, InputGroup, Accordion, Tab, Tabs } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { usuariosData, semanasData, asistenciasData, participacionesData, cursos } from "../data"; // Importar datos locales

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
    const selectedCurso = cursos.find((curso) => curso._id === cursoId);
    setCurso(selectedCurso);

    if (selectedCurso) {
      const participantesIds = selectedCurso.grupos.flatMap((grupo) => grupo.participantes);
      const participantesData = usuariosData.filter((usuario) =>
        participantesIds.includes(usuario.id)
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
      const semanasConSesiones = semanasData.filter((semana) =>
        curso.grupos.some((grupo) => grupo.sesiones.includes(semana.id))
      );
      setAsistencias(asistenciasData); // Simula la carga de asistencias desde datos locales
      setParticipaciones(participacionesData); // Simula la carga de participaciones desde datos locales

      let totalSesiones = 0;
      let sesionesPresentes = 0;
      let sesionesFalta = 0;
      let sesionesTardanzas = 0;
      let sesionesJustificados = 0;
      let sesionesParticipo = 0;

      semanasConSesiones.forEach((semana) => {
        semana.sesiones.forEach((sesion) => {
          totalSesiones++;

          const asistencia = asistenciasData.find((a) => a.tema === sesion.tema);
          const participacion = participacionesData.find((p) => p.tema === sesion.tema);

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
                {semanasData.length > 0 ? (
                  semanasData.map((semana, index) => (
                    <Accordion.Item key={index} eventKey={`${index}`}>
                      <Accordion.Header>Semana {index + 1}</Accordion.Header>
                      <Accordion.Body>
                        <ul>
                          {semana.sesiones.length > 0 ? (
                            semana.sesiones.map((sesion, idx) => (
                              <li key={idx}>
                                {usuario.role === "profesor" ? (
                                  <a style={{color: 'green', fontWeight: '700'}}
                                  href={`#/asistencia/${sesion._id}`} // o usa react-router-dom si es necesario
                                  onClick={(e) => {
                                    e.preventDefault(); // prevenir el comportamiento predeterminado del enlace
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
            <Tab eventKey="estadisticas" title="Estadísticas" className="">
              <Card style={{ width: "", margin: "" }}>
                <Card.Header>
                  <Card.Title>Asistencias en sesiones</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Pie style={{ height: "" }} data={data} options={{ maintainAspectRatio: false }} />
                </Card.Body>
              </Card>
              <Card style={{ width: "", margin: "20px" }}>
                <Card.Header>
                  <Card.Title>Participaciones en sesiones</Card.Title>
                </Card.Header>
                <Card.Body>
                  <Pie
                    data={dataParticipacion}
                    options={{ maintainAspectRatio: false }}
                  />
                </Card.Body>
              </Card>
            </Tab>
          )}

          <Tab
            eventKey="participantes"
            title="Participantes"
            style={{ height: "fit-content" }}
          >
            <div className="container-curso-seleccionado">
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Buscar Participante"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParticipantes.map((participante) => (
                    <tr key={participante.id}>
                      <td>{participante.codigo}</td>
                      <td>{participante.nombre}</td>
                      <td>{participante.role}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Tab>
          <Tab
            eventKey="asistencias"
            title="Asistencia"
            style={{ height: "fit-content" }}
          >
            <div className="container-curso-seleccionado">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tema</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map((asistencia, index) => (
                    <tr key={index}>
                      <td>{asistencia.tema}</td>
                      <td>{formatDate(asistencia.fecha)}</td>
                      <td>{asistencia.asistencia.estado}</td>
                      <td>{formatTime(asistencia.asistencia.hora)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="container-chart">
                <Pie data={data} />
              </div>
            </div>
          </Tab>
          <Tab
            eventKey="participaciones"
            title="Participación"
            style={{ height: "fit-content" }}
          >
            <div className="container-curso-seleccionado">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tema</th>
                    <th>Fecha</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {participaciones.map((participacion, index) => (
                    <tr key={index}>
                      <td>{participacion.tema}</td>
                      <td>{formatDate(participacion.fecha)}</td>
                      <td>{participacion.participacion.comentario}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="container-chart">
                <Pie data={dataParticipacion} />
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Curso;