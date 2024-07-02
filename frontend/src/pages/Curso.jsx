import React, { useState, useEffect, useContext } from "react";
import { useLocation  } from "react-router-dom";
import { Card, Accordion, Button } from "react-bootstrap";
import { Table, FormControl, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

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
            const semanasPromises = semanasIds.map(id => axios.get(`/api/semanas/${id}`));
            const semanasResponses = await Promise.all(semanasPromises);
            const semanasData = semanasResponses.map(response => response.data);

            let asistenciasData = [];
            let participacionesData = [];

            for (const semana of semanasData) {
                for (const sesionId of semana.sesiones) {
                    const sesionResponse = await axios.get(`/api/sesiones/${sesionId}`);
                    const sesion = sesionResponse.data;

                    for (const participante of sesion.participantes) {
                        if (participante.participante === loggedInUser._id) {
                            asistenciasData.push({
                                tema: sesion.tema,
                                fecha: sesion.fecha,
                                asistencia: participante.asistencia
                            });

                            participacionesData.push({
                                tema: sesion.tema,
                                fecha: sesion.fecha,
                                participacion: participante.participacion
                            });
                        }
                    }
                }
            }

            setAsistencias(asistenciasData);
            setParticipaciones(participacionesData);
        } catch (error) {
            console.error("Error fetching asistencias y participaciones", error);
        }
    };

    if (curso && loggedInUser) {
        fetchAsistencias();
    }
}, [curso, loggedInUser]);

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
              {semanas.map((semanaId, index) => (
                <div key={semanaId} className="seccion">
                  <FontAwesomeIcon icon="chevron-right" size="1x" />
                  <h3>Semana {index + 1}</h3>
                </div>
              ))}
            </div>
          </Tab>
          <Tab eventKey="participantes" title="Participantes">
            <div
              className="container-participantes"
              style={{ width: "1200px",overflowY: "auto", maxHeight: "1000px" }}
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
            className="opcion"
            eventKey="calificaciones"
            title="Calificaciones"
          ></Tab>
          {usuario.loggedInUser.role === "alumno" ? (
            <Tab
              eventKey="competencias"
              title="Competencias"
            ></Tab>
          ) : (
            ""
          )}
          {usuario.loggedInUser.role === "alumno" ? (
            <Tab
              eventKey="asistencias"
              title="Asistencias"
            >
                <div className="container-asistencias" style={{ width: "1200px",overflowY: "auto", maxHeight: "1000px" }}>
                            {asistencias.length === 0 ? (
                                <div>No hay asistencias registradas</div>
                            ) : (
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
                                                <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                                                <td>{asistencia.asistencia.estado}</td>
                                                <td>{asistencia.asistencia.hora ? new Date(asistencia.asistencia.hora).toLocaleTimeString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </div>
            </Tab>
          ) : (
            ""
          )}
          <Tab eventKey="participaciones" title="Participaciones">
                        <div className="container-participaciones" style={{width: "1200px",overflowY: "auto", maxHeight: "1000px" }}>
                            {participaciones.length === 0 ? (
                                <div>No hay participaciones registradas</div>
                            ) : (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Tema</th>
                                            <th>Fecha</th>
                                            <th>Comentario</th>
                                            <th>Fecha de Participación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {participaciones.map((participacion, index) => (
                                            <tr key={index}>
                                                <td>{participacion.tema}</td>
                                                <td>{new Date(participacion.fecha).toLocaleDateString()}</td>
                                                <td>{participacion.participacion.comentario}</td>
                                                <td>{participacion.participacion.fecha ? new Date(participacion.participacion.fecha).toLocaleDateString() : 'N/A'}</td>
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
