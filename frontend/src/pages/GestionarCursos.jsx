import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GestionarCursos() {
    const [lista, setLista] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      obtenerCursos();
    }, []);
  
    const obtenerCursos = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/cursos');
        console.log('Datos obtenidos del servidor:', res.data);
        setLista(res.data); // Asigna los datos recibidos al estado lista
      } catch (error) {
        console.error("Error al obtener los cursos:", error);
      }
    };

    const crearCurso = () => {
        navigate('/crear_curso'); // Navegar al formulario de creación de usuario
    };

    return (
        <>
            <Button variant='primary' onClick={crearCurso}>Agregar Curso</Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Grado</th>
                        <th>Carrera</th>
                        <th>Facultad</th>
                        <th>Ciclo</th>
                        <th>Semestre</th>
                    </tr>
                </thead>
                <tbody>
                    {lista.map(curso => (
                        <tr key={curso._id}>
                            <td>{curso._id}</td>
                            <td>{curso.codigo}</td>
                            <td>{curso.nombre}</td>
                            <td>{curso.grado}</td>
                            <td>{curso.carrera}</td>
                            <td>{curso.facultad}</td>
                            <td>{curso.ciclo}</td>
                            <td>{curso.semestre}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
}

export default GestionarCursos;
