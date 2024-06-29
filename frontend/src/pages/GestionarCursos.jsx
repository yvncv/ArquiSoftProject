import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, FormControl, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function GestionarCursos() {
    const [lista, setLista] = useState([]);
    const [filteredLista, setFilteredLista] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
      obtenerCursos();
    }, []);

    useEffect(() => {
      const filtered = lista.filter(curso => 
        curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        curso.carrera.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLista(filtered);
      setCurrentPage(1); // Reset page to 1 after search
    }, [searchTerm, lista]);
  
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

    const handleSearch = (event) => {
      setSearchTerm(event.target.value);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLista.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
        <div className="boton-agregar-curso">
            <Button variant='primary' onClick={crearCurso}>Agregar Curso</Button>
        </div>
        <div className='contenido-gestionar-curso'>
            <div className='buscador-gestionar-curso'>
            <InputGroup className="mb-3">
              <FormControl
                className='campo-buscar'
                placeholder="Buscar cursos"
                aria-label="Buscar cursos"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
            </div>
            <div className='tabla-gestionar-cursos'>
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
                    {currentItems.map(curso => (
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
            </div>
            <div className='paginacion-gestionar-cursos'>
            <Pagination className="paginacion-gestion">
              <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
              {Array.from({ length: Math.ceil(filteredLista.length / itemsPerPage) }, (_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredLista.length / itemsPerPage)} />
            </Pagination>
            </div>
        </div>
            
        </>
    );
}

export default GestionarCursos;
