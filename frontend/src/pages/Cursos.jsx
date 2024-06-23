import React, { useContext, useState, useEffect } from "react";
import { Card, Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Cursos = () => {
  const { login } = useContext(AuthContext);
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado de carga
  const navigate = useNavigate();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/cursos");
        console.log(response.data.data);
        setCursos(response.data.data);
        console.log(cursos);
      } catch (error) {
        setError("Error al obtener los cursos");
      }
    };

    fetchCursos();
  }, []);

  const formatCarrera = (carrera) => {
    const palabras = carrera.split(" ");
    const primeraPalabra = palabras[0].substring(0, 3).toUpperCase() + ".";
    return `${primeraPalabra} ${palabras.slice(1).join(" ").toUpperCase()}`;
  };

  return (
    <>
      <div className="container-curso-total">
        <div className="texto-bienvenida">
          <h1>¡Bienvenido de nuevo, Piero!</h1>
        </div>
        <div className="container-curso">
          <Row className="container-cursos-vista">
            {cursos.length === 0 ? (
              <div>No hay cursos disponibles</div>
            ) : (
              cursos.map((curso) => (
                <Col md={4} key={curso._id}>
                  <Card className="mb-3">
                    <Card.Body>
                      <img src="/imagen-curso.svg" alt="" />
                      <Card.Title>{curso.nombre}</Card.Title>
                      <Card.Text>
                        {curso.grado.toUpperCase()}/
                        {curso.facultad.toUpperCase()}/
                        {formatCarrera(curso.carrera)}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </div>
      </div>
    </>
  );
};

export default Cursos;
