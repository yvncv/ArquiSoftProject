import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function GestionarSesion() {
  const [sesion, setSesion] = useState(null);
  const [randomStudent, setRandomStudent] = useState(null); // Estado para el estudiante seleccionado aleatoriamente
  const { id } = useParams();

  useEffect(() => {
    const fetchSesion = async (sesionId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/sesiones/${sesionId}`);
        const sesionData = response.data;

        const participantesActualizados = await Promise.all(
          sesionData.participantes.map(async (participante) => {
            const response = await axios.get(`http://localhost:8080/api/usuarios/${participante.participante}`);
            const participanteData = response.data;

            return {
              ...participante,
              participante: participanteData,
              asistencia: participante.asistencia || { estado: '', hora: null },
              participacion: participante.participacion || { comentario: '', fecha: null }
            };
          })
        );

        // Filtrar solo participantes cuyo rol sea "alumno"
        const alumnos = participantesActualizados.filter(participante => participante.participante.role === 'alumno');

        setSesion({ ...sesionData, participantes: alumnos });
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    if (id) {
      fetchSesion(id);
    }
  }, [id]);

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

  const handleSave = async () => {
    const allAttended = sesion.participantes.every(
      (participante) => participante.asistencia && participante.asistencia.estado !== ''
    );
    if (!allAttended) {
      alert('Por favor, marque la asistencia para todos los participantes.');
      return;
    }

    try {
      const participantesToUpdate = sesion.participantes.map((participante) => ({
        participante: participante.participante._id,
        asistencia: {
          estado: participante.asistencia.estado,
          hora: participante.asistencia.hora
        },
        participacion: {
          comentario: participante.participacion.comentario,
          fecha: participante.participacion.fecha
        }
      }));

      const response = await axios.put(`http://localhost:8080/api/sesiones/${id}`, {
        participantes: participantesToUpdate
      });

      console.log('Attendance saved successfully:', response.data);
      alert('Asistencia guardada exitosamente!');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error al guardar la asistencia. Intente nuevamente.');
    }
  };

  const handleClear = () => {
    const clearedSesion = { ...sesion };
    clearedSesion.participantes.forEach((participante) => {
      participante.asistencia = { estado: '', hora: null };
      participante.participacion = { comentario: '', fecha: null };
      setRandomStudent(null);
    });
    setSesion(clearedSesion);
  };

  const handleRandomSelect = () => {
    if (sesion && sesion.participantes.length > 0) {
      const randomIndex = Math.floor(Math.random() * sesion.participantes.length);
      const selectedStudent = sesion.participantes[randomIndex].participante;
      setRandomStudent(selectedStudent);
    }
  };

  if (!sesion) {
    return <p>Cargando sesión...</p>;
  }

  return (
    <>
      <h3 style={{ width: '70%', margin: '20px auto', textAlign: 'center' }}>Asistencia y participación para la Sesión: {sesion.tema}</h3>
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
              <td>{participante.participante.codigo}</td>
              <td>{participante.participante.nombre}</td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="presente"
                  checked={participante.asistencia && participante.asistencia.estado === 'presente'}
                  onChange={() => handleAttendanceChange(index, 'presente')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="falta"
                  checked={participante.asistencia && participante.asistencia.estado === 'falta'}
                  onChange={() => handleAttendanceChange(index, 'falta')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="tardanza"
                  checked={participante.asistencia && participante.asistencia.estado === 'tardanza'}
                  onChange={() => handleAttendanceChange(index, 'tardanza')}
                />
              </td>
              <td>
                <Form.Check
                  type="radio"
                  name={`attendance-${index}`}
                  value="justificado"
                  checked={participante.asistencia && participante.asistencia.estado === 'justificado'}
                  onChange={() => handleAttendanceChange(index, 'justificado')}
                />
              </td>
              <td>
                <Form.Control
                  type="text"
                  name={`participacion-${index}`}
                  value={participante.participacion?.comentario || ''}
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
          Random
        </Button>
      </div>
      {randomStudent && (
        <div style={{ width: '70%', margin: '20px auto', textAlign: 'center', color: 'red' }}>
          <p>Estudiante seleccionado aleatoriamente:</p>
          <p>Código: {randomStudent.codigo}</p>
          <p>Nombre: {randomStudent.nombre}</p>
        </div>
      )}
    </>
  );
}

export default GestionarSesion;
