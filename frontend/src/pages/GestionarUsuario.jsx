import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ModalEliminar from '../components/ModalEliminar';
import axios from 'axios';

function GestionarUsuarios() {
    const [lista, setLista] = useState([]);
    const [idEliminarUsuario, setIdEliminarUsuario] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        obtenerUsuarios();
    }, []);

    const obtenerUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/usuarios');
            console.log('Datos obtenidos del servidor:', res.data);
            setLista(res.data);
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
        }
    };

    const handleMostrarModal = (id) => {
        setIdEliminarUsuario(id);
        setMostrarModal(true);
    };

    const handleCerrarModal = () => {
        setMostrarModal(false);
        setIdEliminarUsuario(null);
    };

    const eliminarUsuario = async () => {
        if (idEliminarUsuario) {
            try {
                await axios.delete(`http://localhost:8080/api/usuarios/${idEliminarUsuario}`);
                setLista(prevLista => prevLista.filter(usuario => usuario._id !== idEliminarUsuario));
            } catch (error) {
                console.error("Error al eliminar el usuario:", error);
            } finally {
                handleCerrarModal();
            }
        }
    };

    const editarUsuario = (id) => {
        navigate(`/agregar_usuario/${id}`); // Navegar al componente de edición con el id del usuario
    };

    const crearUsuario = () => {
        navigate('/agregar_usuario'); // Navegar al formulario de creación de usuario
    };

    return (
        <>
            <Button variant='primary' onClick={crearUsuario}>Crear Usuario</Button>
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
                    {lista.map(usuario => (
                        <tr key={usuario._id}>
                            <td>{usuario._id}</td>
                            <td>{usuario.codigo}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.carrera}</td>
                            <td>{usuario.ciclo}</td>
                            <td>{usuario.correo}</td>
                            <td>{usuario.role}</td>
                            <td>
                                <Button 
                                    variant='success' 
                                    onClick={() => editarUsuario(usuario._id)}
                                >
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button 
                                    variant='danger' 
                                    onClick={() => handleMostrarModal(usuario._id)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
