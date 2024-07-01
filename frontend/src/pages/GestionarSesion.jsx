import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function GestionarSesion() {
  const [sesion, setSesion] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchSesion = async (sesionId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/sesiones/${sesionId}`);
        const sesionData = response.data;

        // Obtener información completa de cada participante
        const participantesActualizados = await Promise.all(
          sesionData.participantes.map(async participante => {
            const response = await axios.get(`http://localhost:8080/api/usuarios/${participante.participante}`);
            const participanteData = response.data;

            return {
              ...participante,
              participante: participanteData // Actualizar el objeto participante con los datos completos
            };
          })
        );

        setSesion({ ...sesionData, participantes: participantesActualizados });
      } catch (error) {
        console.error('Error fetching session:', error);
        // Handle error (e.g., show error message)
      }
    };

    if (id) {
      fetchSesion(id);
    }
  }, [id]);

  const handleAttendanceChange = (index, value) => {
    setSesion(prevSesion => {
      const newSesion = { ...prevSesion };
      newSesion.participantes[index].asistencia = {
        estado: value,
        hora: new Date().getHours()
      };
      return newSesion;
    });
  };

  const handleSave = async () => {
    const allAttended = sesion.participantes.every(participante => participante.asistencia.estado !== '');
    if (!allAttended) {
      alert('Por favor, marque la asistencia para todos los participantes.');
      return;
    }

    try {
      // Preparar datos para enviar al servidor
      const participantesToUpdate = sesion.participantes.map(participante => ({
        participante: participante.participante._id, // Asegúrate de usar el ID correcto del participante
        asistencia: {
          estado: participante.asistencia.estado,
          hora: participante.asistencia.hora, // Incluye la hora si es necesario
        }
      }));

      // Enviar datos al servidor
      const response = await axios.put(`http://localhost:8080/api/sesiones/${id}`, {
        participantes: participantesToUpdate,
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
    clearedSesion.participantes.forEach(participante => {
      participante.asistencia.estado = '';
      participante.asistencia.hora = null;
    });
    setSesion(clearedSesion);
  };

  if (!sesion) {
    return <p>Cargando sesión...</p>;
  }

  return (
    <>
      <h3>Asistencia para la Sesión: {sesion.tema}</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Presente</th>
            <th>Falta</th>
            <th>Tardanza</th>
            <th>Justificado</th>
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
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="primary" onClick={handleSave}>
        Guardar
      </Button>
      <Button variant="secondary" onClick={handleClear} style={{ marginLeft: '10px' }}>
        Limpiar
      </Button>
    </>
  );
}

export default GestionarSesion;