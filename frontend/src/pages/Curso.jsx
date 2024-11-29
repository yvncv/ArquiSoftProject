import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  const { curso } = location.state || {}; // Obtiene el curso desde el estado
  const { loggedInUser } = useContext(AuthContext);
  const usuario = loggedInUser;
  const [key, setKey] = useState("home");
  const [asistencias, setAsistencias] = useState([]);  // Datos simulados de asistencias
  const [participaciones, setParticipaciones] = useState([]);  // Datos simulados de participaciones
  const [estadisticas, setEstadisticas] = useState({ total: 0, presente: 0 });
  const [estadisticasParticipacion, setEstadisticasParticipacion] = useState({
    total: 0,
    participo: 0,
  });
  const [sessionsByWeek, setSessionsByWeek] = useState([]);

  useEffect(() => {
    if (curso) {
      // Agrupar las sesiones del curso por semana
      const sesionesPorSemana = agruparSesionesPorSemana(curso); 
      setSessionsByWeek(sesionesPorSemana);

      // Aquí cargarías los datos de asistencias y participaciones, si los tienes
      setAsistencias(asistencias);  // Simula la carga de asistencias
      setParticipaciones(participaciones);  // Simula la carga de participaciones
    }
  }, [curso, asistencias, participaciones]);

  const agruparSesionesPorSemana = (curso) => {
    const sesionesPorSemana = [];
    let semanaCount = 1;

    // Filtramos las sesiones que pertenecen a este curso
    const sesionesCurso = sesiones.filter(sesion => sesion.curso === curso.codigo);

    // Recorremos las sesiones y las agrupamos en semanas
    for (let semana = 1; semana <= 16; semana++) {
      let sesionesDeSemana = sesionesCurso.filter(sesion => sesion.semana === semana);

      sesionesPorSemana.push({
        semana: semanaCount,
        sesiones: sesionesDeSemana,
      });
      semanaCount++;
    }

    return sesionesPorSemana;
  };

  useEffect(() => {
    if (curso && usuario) {
      let totalSesiones = 0;
      let sesionesPresentes = 0;
      let sesionesFalta = 0;
      let sesionesTardanzas = 0;
      let sesionesJustificados = 0;
      let sesionesParticipo = 0;

      // Recorremos las semanas y las sesiones para calcular las estadísticas
      sessionsByWeek.forEach((semana) => {
        semana.sesiones.forEach((sesion) => {
          totalSesiones++;

          // Buscar asistencia y participación por tema
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
  }, [curso, usuario, sessionsByWeek, asistencias, participaciones]);

  if (!curso) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <div className="container-curso-seleccionado-total">
      <div className="nombre-curso">
        <h1>{curso.nombre}</h1>
      </div>
      <Tabs
        className="container-curso-seleccionado opciones-curso mb-3"
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="home" title="Home">
          <div className="container-curso-seleccionado">
            <Accordion defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>General</Accordion.Header>
              </Accordion.Item>
              {sessionsByWeek.length > 0 ? (
                sessionsByWeek.map((semana, index) => (
                  <Accordion.Item key={index} eventKey={`${index}`}>
                    <Accordion.Header>Semana {semana.semana}</Accordion.Header>
                    <Accordion.Body>
                      <ul>
                        {semana.sesiones.map((sesion, idx) => (
                          <li key={idx}>
                            <Link to={`/asistencia/${sesion._id}`}>
                              {sesion.tema} ({sesion.grupo} - {sesion.tipoGrupo})
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </Accordion.Body>
                  </Accordion.Item>
                ))
              ) : (
                <p>No hay semanas disponibles.</p>
              )}
            </Accordion>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default Curso;
