import React, { useState, useEffect } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { cursos, usuariosData } from "../data"; // Importar los datos locales

const Cursos = () => {
  const [cursosFiltrados, setCursosFiltrados] = useState([]);
  const [usuario, setUsuario] = useState(null); // Estado local para el usuario
  const navigate = useNavigate(); // Obtener el navigate

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUsuario(decoded.usuario);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    };

    obtenerUsuario();
  }, []);
  
  useEffect(() => {
    if (usuario) {
      console.log(`Bienvenido, ${usuario.nombre}`);
    }
  }, [usuario]); // Ejecutar este efecto cuando `usuario` cambie

  useEffect(() => {
    if (usuario) {
      // Filtrar los cursos en base al usuario
      const cursosFiltrados = cursos.filter((curso) =>
        curso.grupos.some((grupo) => 
          grupo.participantes.includes(usuario.id)
        )
      );
      setCursosFiltrados(cursosFiltrados);
    } else {
      setCursosFiltrados([]);
    }
  }, [usuario]); // Filtrar cursos cada vez que el usuario cambie

  const formatCarrera = (carrera) => {
    const palabras = carrera.split(" ");
    const primeraPalabra = palabras[0].substring(0, 3).toUpperCase() + ".";
    return `${primeraPalabra} ${palabras.slice(1).join(" ").toUpperCase()}`;
  };

  const handleCardClick = (curso) => {
    navigate(`/curso/${curso.nombre}`, { state: { curso } });
  };

  return (
    <>
      <div className="container-curso-total">
        <div className="texto-bienvenida">
          {usuario ? (<h1>¡Bienvenido de nuevo, {usuario.nombre}!</h1>) : (<h1>¡Bienvenido, aún no has iniciado sesión!</h1>)}
        </div>
        <div className="container-curso">
          <Row className="container-cursos-vista">
            {cursosFiltrados.length === 0 ? (
              <div>No hay cursos disponibles</div>
            ) : (
              cursosFiltrados.map((curso) => (
                <Col md={4} key={curso._id}>
                  <Card className="mb-3">
                    <Card.Body>
                      <img src="/imagen-curso.svg" alt="" />
                      <Card.Title onClick={() => handleCardClick(curso)}>{curso.nombre}</Card.Title>
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
