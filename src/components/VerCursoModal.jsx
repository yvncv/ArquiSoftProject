import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup } from 'react-bootstrap';
import axios from "axios";

function VerCursoModal({ show, handleClose, curso }) {
    // const [alumnos, setAlumnos] = useState([]);

    // useEffect(() => {
    //     const fetchAlumnos = async () => {
    //       try {
    //         const response = await axios.get("http://localhost:8080/api/usuarios/");
    //         setAlumnos(response.data);
    //       } catch (error) {
    //         console.error("Error fetching students:", error);
    //       }
    //     };
    
    //     fetchAlumnos();
    //   },);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Curso</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          <ListGroup.Item><strong>Nombre:</strong> {curso.nombre}</ListGroup.Item>
          <ListGroup.Item><strong>Código:</strong> {curso.codigo}</ListGroup.Item>
          <ListGroup.Item><strong>Grado:</strong> {curso.grado}</ListGroup.Item>
          <ListGroup.Item><strong>Carrera:</strong> {curso.carrera}</ListGroup.Item>
          <ListGroup.Item><strong>Facultad:</strong> {curso.facultad}</ListGroup.Item>
          <ListGroup.Item><strong>Ciclo:</strong> {curso.ciclo}</ListGroup.Item>
          <ListGroup.Item><strong>Semestre:</strong> {curso.semestre}</ListGroup.Item>
          <ListGroup.Item>
            <strong>Grupos:</strong>
            {curso.grupos.map((grupo, index) => (
              <div key={index}>
                <p><strong>Tipo de Grupo:</strong> {grupo.tipoGrupo}</p>
                {grupo.horario.map((h, index) => (
                    <div key={index}>
                        <strong>Horario {index + 1}:</strong>
                        <p><strong>Día:</strong> {h.dia}</p>
                        <p><strong>Hora:</strong> {h.hora}</p>
                    </div>
                ))}
                <p><strong>Participantes:</strong> {grupo.participantes.map((participante) => participante.nombre).join(", ")}</p>
                {/* Aquí puedes añadir más detalles sobre las sesiones */}
              </div>
            ))}
          </ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VerCursoModal;
