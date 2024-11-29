import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Form } from 'react-bootstrap';
import { sesiones, usuarios } from '../data'; // Importa tus datos de sesiones y usuarios

function GestionarSesion() {
  const { id } = useParams(); // Obtén el ID de la sesión desde la URL
  const [sesion, setSesion] = useState(null); // Estado para la sesión cargada
  const [randomStudent, setRandomStudent] = useState(null); // Estado para el estudiante seleccionado aleatoriamente

  useEffect(() => {
    const fetchSesion = (id) => {
      // Encuentra la sesión con el ID correspondiente
      const sesionSeleccionada = sesiones.find((sesion) => sesion._id === id);
      setSesion(sesionSeleccionada);
    };

    if (id) {
      fetchSesion(id); // Cargar la sesión cuando el ID cambie
    }
  }, [id]);

  if (!sesion) {
    return <p>Cargando sesión...</p>;
  }

  const handleAttendanceChange = (index, value) => {
    setSesion((prevSesion) => {
      const newSesion = { ...prevSesion };
      newSesion.participantes[index].asistencia = {
        estado: value,
        hora: new Date().toLocaleString()
      };
      return newSesion;
    });
  };

  const handleParticipationChange = (index, value) => {
    setSesion((prevSesion) => {
      const newSesion = { ...prevSesion };
      newSesion.participantes[index].participacion = {
        comentario: value,
        fecha: new Date().toLocaleString()
      };
      return newSesion;
    });
  };

  const handleSave = () => {
    const allAttended = sesion.participantes.every(
      (participante) => participante.asistencia && participante.asistencia.estado !== ''
    );
    if (!allAttended) {
      alert('Por favor, marque la asistencia para todos los participantes.');
      return;
    }

    // Aquí puedes agregar la lógica para guardar los datos de asistencia y participación
    console.log('Asistencia y participación guardada:', sesion);
    alert('Asistencia guardada exitosamente!');
  };

  const handleClear = () => {
    const clearedSesion = { ...sesion };
    clearedSesion.participantes.forEach((participante) => {
      participante.asistencia = { estado: '', hora: null };
      participante.participacion = { comentario: '', fecha: null };
    });
    setSesion(clearedSesion);
    setRandomStudent(null);
  };

  const handleRandomSelect = () => {
    if (sesion && sesion.participantes.length > 0) {
      const randomIndex = Math.floor(Math.random() * sesion.participantes.length);
      const selectedStudent = sesion.participantes[randomIndex];
      setRandomStudent(selectedStudent);
    }
  };

  return (
    <>
      <h3 style={{ width: '70%', margin: '20px auto', textAlign: 'center' }}>
        Asistencia y participación para la Sesión: {sesion.tema}
      </h3>
      <Table variant='success' striped bordered hover style={{ width: '70%', margin: '20px auto' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Presente</th>
            <th>Falta</th>
            <th>Tardanza</th>
            <th>Justificado</th>
            <th>Participación</th>
          </tr>
        </thead>
        <tbody>
          {sesion.participantes.map((participante, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{participante.participante}</td>
              <td>{participante.nombre}</td> {/* Ahora se muestra el nombre del participante */}
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="presente"
                  checked={participante.asistencia.estado === 'presente'}
                  onChange={() => handleAttendanceChange(index, 'presente')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="falta"
                  checked={participante.asistencia.estado === 'falta'}
                  onChange={() => handleAttendanceChange(index, 'falta')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="tardanza"
                  checked={participante.asistencia.estado === 'tardanza'}
                  onChange={() => handleAttendanceChange(index, 'tardanza')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="justificado"
                  checked={participante.asistencia.estado === 'justificado'}
                  onChange={() => handleAttendanceChange(index, 'justificado')}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  value={participante.participacion.comentario}
                  onChange={(e) => handleParticipationChange(index, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px auto' }}>
        <Button variant="success" onClick={handleSave} style={{ marginRight: '10px' }}>
          Guardar
        </Button>
        <Button variant="secondary" onClick={handleClear} style={{ marginRight: '10px' }}>
          Limpiar
        </Button>
        <Button variant="primary" onClick={handleRandomSelect}>
          Seleccionar Aleatorio
        </Button>
      </div>
      {randomStudent && (
        <div style={{ width: '70%', margin: '20px auto', textAlign: 'center', color: 'red' }}>
          <p>Estudiante seleccionado aleatoriamente:</p>
          <p>Código: {randomStudent.participante}</p>
          <p>Nombre: {randomStudent.nombre}</p>
        </div>
      )}
    </>
  );
}

export default GestionarSesion;
