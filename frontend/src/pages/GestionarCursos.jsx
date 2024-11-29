import React, { useState, useEffect } from 'react';
import { Table, Button, FormControl, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { usuarios, cursos, sesiones, semanas } from '../data';
import EditarCursoModal from '../components/EditarCursoModal';
import VerCursoModal from '../components/VerCursoModal';

function GestionarCursos() {
  const [lista, setLista] = useState([]); // Lista de cursos
  const [filteredLista, setFilteredLista] = useState([]); // Lista filtrada por búsqueda
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(10); // Elementos por página
  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null); // Curso seleccionado para ver o editar
  const [showEditarModal, setShowEditarModal] = useState(false); // Estado para mostrar el modal de edición
  const [showVerModal, setShowVerModal] = useState(false); // Estado para mostrar el modal de ver curso
  const [showEliminarModal, setShowEliminarModal] = useState(false); // Estado para mostrar el modal de eliminación
  const [cursoAEliminar, setCursoAEliminar] = useState(null); // Curso a eliminar
  const navigate = useNavigate(); // Navegar a otras páginas

  useEffect(() => {
    setLista(cursos); // Cargar los cursos directamente desde data.js
  }, []);

  useEffect(() => {
    const filtered = lista.filter(curso =>
      curso.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.carrera.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLista(filtered);
    setCurrentPage(1); // Resetear la página a 1 después de hacer búsqueda
  }, [searchTerm, lista]);

  const crearCurso = () => {
    navigate('/crear_curso'); // Navegar al formulario de creación de curso
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda
  };

  const handleEditarCurso = (curso) => {
    setCursoSeleccionado(curso);
    setShowEditarModal(true); // Mostrar modal de edición
  };

  const handleVerCurso = (curso) => {
    setCursoSeleccionado(curso);
    setShowVerModal(true); // Mostrar modal de ver curso
  };

  const handleEliminarCurso = () => {
    setLista(lista.filter(curso => curso._id !== cursoAEliminar._id)); // Eliminar curso de la lista
    setShowEliminarModal(false); // Cerrar el modal de eliminación
  };

  const handleConfirmarEliminar = (curso) => {
    setCursoAEliminar(curso);
    setShowEliminarModal(true); // Mostrar modal de confirmación de eliminación
  };

  const actualizarCursoEnLista = (cursoActualizado) => {
    const listaActualizada = lista.map(curso =>
      curso._id === cursoActualizado._id ? cursoActualizado : curso
    );
    setLista(listaActualizada); // Actualizar la lista de cursos
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLista.slice(indexOfFirstItem, indexOfLastItem); // Elementos de la página actual

  const paginate = (pageNumber) => setCurrentPage(pageNumber); // Cambiar la página actual

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
                <th>Código</th>
                <th>Nombre</th>
                <th>Grado</th>
                <th>Carrera</th>
                <th>Facultad</th>
                <th>Ciclo</th>
                <th>Semestre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(curso => (
                <tr key={curso._id}>
                  <td>{curso.codigo}</td>
                  <td>{curso.nombre}</td>
                  <td>{curso.grado}</td>
                  <td>{curso.carrera}</td>
                  <td>{curso.facultad}</td>
                  <td>{curso.ciclo}</td>
                  <td>{curso.semestre}</td>
                  <td>
                    <Button variant="info" onClick={() => handleVerCurso(curso)}>Ver</Button>{' '}
                    <Button variant="warning" onClick={() => handleEditarCurso(curso)}>Editar</Button>{' '}
                    <Button variant="danger" onClick={() => handleConfirmarEliminar(curso)}>Eliminar</Button>
                  </td>
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

      {cursoSeleccionado && (
        <>
          <EditarCursoModal
            show={showEditarModal}
            handleClose={() => setShowEditarModal(false)}
            curso={cursoSeleccionado}
            actualizarCursoEnLista={actualizarCursoEnLista}
          />
          <VerCursoModal
            show={showVerModal}
            handleClose={() => setShowVerModal(false)}
            curso={cursoSeleccionado}
          />
        </>
      )}

      <Modal show={showEliminarModal} onHide={() => setShowEliminarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar el curso {cursoAEliminar && cursoAEliminar.nombre}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEliminarModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleEliminarCurso}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default GestionarCursos;
