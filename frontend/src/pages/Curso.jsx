import React from "react";
import { useLocation } from "react-router-dom";
import { Card, Accordion, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Curso = () => {
  const location = useLocation();
  const { curso } = location.state || {};

  if (!curso) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <>
    <div className="container-curso-seleccionado-total">
        <div className="nombre-curso">
            <h1>{curso.nombre}</h1>
        </div>
        <div className="container-curso-seleccionado opciones-curso">
            <div className="opcion activo">
                <h3>Curso</h3>
            </div>
            <div className="opcion">
                <h3>Participantes</h3>
            </div>
            <div className="opcion">
                <h3>Calificaciones</h3>
            </div>
            <div className="opcion">
                <h3>Competencias</h3>
            </div>
        </div>
        <div className="container-curso-seleccionado">
            <div className="seccion">
                <FontAwesomeIcon icon="chevron-right" size="1x" />
                <h3>General</h3>
            </div>
        </div>
    </div>
    </>
  );
};

export default Curso;
