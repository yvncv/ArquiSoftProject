import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button, FormControl, InputGroup, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModalEliminar from '../components/ModalEliminar';
import { usuarios, cursos, sesiones, semanas } from '../data';

function GestionarUsuarios() {
    const [lista, setLista] = useState([]);
    const [filteredLista, setFilteredLista] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [idEliminarUsuario, setIdEliminarUsuario] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar usuarios desde los datos simulados
        setLista(usuarios);
    }, []);

    useEffect(() => {
        const filtered = lista.filter(usuario => 
            usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.carrera.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLista(filtered);
        setCurrentPage(1); // Reset page to 1 after search
    }, [searchTerm, lista]);

    const handleMostrarModal = (id) => {
        setIdEliminarUsuario(id);
        setMostrarModal(true);
    };

    const handleCerrarModal = () => {
        setMostrarModal(false);
        setIdEliminarUsuario(null);
    };

    const eliminarUsuario = () => {
        if (idEliminarUsuario) {
            setLista(prevLista => prevLista.filter(usuario => usuario.id !== idEliminarUsuario));
            handleCerrarModal();
        }
    };

    const editarUsuario = (id) => {
        navigate(`/agregar_usuario/${id}`); // Navegar al componente de edición con el id del usuario
    };

    const crearUsuario = () => {
        navigate('/agregar_usuario'); // Navegar al formulario de creación de usuario
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
        <div className="boton-agregar-usuario">
            <Button variant='primary' onClick={crearUsuario}>Crear Usuario</Button>
        </div>
        <div className='contenido-gestionar-usuario'>
            <div className='buscador-gestionar-usuario'>
            <InputGroup className="mb-3">
              <FormControl
                className='campo-buscar'
                placeholder="Buscar usuarios"
                aria-label="Buscar usuarios"
                aria-describedby="basic-addon2"
                value={searchTerm}
                onChange={handleSearch}
              />
            </InputGroup>
            </div>
            <div className='tabla-gestionar-usuarios'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Codigo</th>
                        <th>Nombre</th>
                        <th>Carrera</th>
                        <th>Ciclo</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Actualizar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(usuario => (
                        <tr key={usuario.id}>
                            <td>{usuario.id}</td>
                            <td>{usuario.codigo}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.carrera}</td>
                            <td>{usuario.ciclo}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.role}</td>
                            <td>
                                <Button 
                                    variant='success' 
                                    onClick={() => editarUsuario(usuario.id)}
                                >
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button 
                                    variant='danger' 
                                    onClick={() => handleMostrarModal(usuario.id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            </div>
            <div className='paginacion-gestionar-usuarios'>
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
        
        <ModalEliminar
            show={mostrarModal}
            handleClose={handleCerrarModal}
            handleConfirm={eliminarUsuario}
            obj="usuario"
        />
        </>
    );
}

export default GestionarUsuarios;
