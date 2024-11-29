import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { usuarios, cursos, sesiones, semanas } from '../data';

function GestionarSesion() {
  const [sesion, setSesion] = useState(null);
  const [randomStudent, setRandomStudent] = useState(null); // Estado para el estudiante seleccionado aleatoriamente
  const { id } = useParams();

  useEffect(() => {
    const fetchSesion = (sesionId) => {
      try {
        // Buscar la sesión correspondiente en semanas
        const semana = semanas.find((semana) =>
          semana.sesiones.some((sesion) => sesion._id === sesionId)
        );

        if (semana) {
          const sesionData = semana.sesiones.find((sesion) => sesion._id === sesionId);

          // Aquí se actualiza los participantes con la información de los usuarios
          const participantesActualizados = sesionData.participantes.map((participanteId) => {
            const participanteData = usuarios.find((usuario) => usuario.id === participanteId);
            return {
              _id: participanteData.id,
              nombre: participanteData.nombre,
              codigo: participanteData.codigo,
              role: participanteData.role,
              asistencia: { estado: '', hora: null },
              participacion: { comentario: '', fecha: null }
            };
          });

          setSesion({ ...sesionData, participantes: participantesActualizados });
        }
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
      setRandomStudent(null);
    });
    setSesion(clearedSesion);
  };

  const handleRandomSelect = () => {
    if (sesion && sesion.participantes.length > 0) {
      const randomIndex = Math.floor(Math.random() * sesion.participantes.length);
      const selectedStudent = sesion.participantes[randomIndex];
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
              <td>{participante.codigo}</td>
              <td>{participante.nombre}</td>
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
