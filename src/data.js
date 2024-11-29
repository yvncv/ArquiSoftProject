import { faker } from '@faker-js/faker';

// Definimos las carreras posibles para cada facultad
const carrerasPorFacultad = {
  ingenieria: ["Informática", "Civil", "Industrial", "Electrónica", "Mecatrónica"],
  derecho: ["Derecho"],
  arquitectura: ["Arquitectura"],
  cienciasEconomicas: ["Economía", "Administración de Empresas", "Contabilidad"],
  psicologia: ["Psicología"],
  lenguasModernas: ["Traducción e Interpretación", "Idiomas Modernos"],
  medicina: ["Medicina"],
  biologiaHumana: ["Biología", "Biomedicina"],
};

// Generar 40 usuarios
const generateUsers = () => {
  const users = [];
  for (let i = 0; i < 40; i++) {
    const facultades = Object.keys(carrerasPorFacultad);
    const facultad = faker.helpers.arrayElement(facultades);
    const carrera = faker.helpers.arrayElement(carrerasPorFacultad[facultad]);
    
    users.push({
      nombre: faker.name.fullName(),
      facultad: facultad,
      carrera: carrera,
      ciclo: faker.number.int({ min: 1, max: 10 }).toString(),
      codigo: faker.string.uuid(),
      correo: faker.internet.email(),
      password: faker.internet.password(),
      role: faker.helpers.arrayElement(["profesor", "estudiante", "admin"]),
    });
  }
  return users;
};

const generateCourses = (users) => {
  const courses = [];
  for (let i = 0; i < 40; i++) {
    const facultades = Object.keys(carrerasPorFacultad);
    const facultad = faker.helpers.arrayElement(facultades);
    const carrera = faker.helpers.arrayElement(carrerasPorFacultad[facultad]);
    const semestre = faker.number.int({ min: 2020, max: 2080 }).toString().concat(faker.helpers.arrayElement(["-I", "-II"]));

    // Dividir los usuarios en dos grupos aleatorios para cada curso
    const shuffledUsers = [...users];
    faker.helpers.shuffle(shuffledUsers);

    const grupo1Participants = shuffledUsers.slice(0, 10);
    const grupo2Participants = shuffledUsers.slice(10, 20);

    courses.push({
      nombre: `Curso ${faker.commerce.productName()}`,
      codigo: faker.string.uuid(),
      grado: faker.helpers.arrayElement(["Pregrado", "Posgrado"]),
      carrera: carrera,
      facultad: facultad,
      ciclo: faker.number.int({ min: 1, max: 10 }),
      semestre: semestre,
      grupos: [
        {
          grupo: 1,
          tipoGrupo: "Teórico",
          horario: [
            { dia: "Lunes", hora: "08:00 AM" },
            { dia: "Miércoles", hora: "08:00 AM" },
          ],
          participantes: grupo1Participants,
        },
        {
          grupo: 2,
          tipoGrupo: "Práctico",
          horario: [
            { dia: "Martes", hora: "10:00 AM" },
            { dia: "Jueves", hora: "10:00 AM" },
          ],
          participantes: grupo2Participants,
        },
      ],
      participantes: [...grupo1Participants, ...grupo2Participants],
    });
  }
  return courses;
};

const generateSessions = (courses) => {
  const sessions = [];

  courses.forEach((course) => {
    course.grupos.forEach((grupo) => {
      for (let semana = 1; semana <= 16; semana++) {
        const sesionesPorSemana = grupo.horario.length;

        for (let sesion = 1; sesion <= sesionesPorSemana; sesion++) {
          const horario = grupo.horario[sesion - 1];

          // Genera una fecha de sesión aleatoria
          const fecha = faker.date.soon();
          
          sessions.push({
            _id: `${course.codigo}-${semana}-${sesion}`, // ID único basado en curso, semana y sesión
            tema: `Tema de sesión ${semana}-${sesion}`,
            fecha: fecha, 
            curso: course.codigo,
            semana: semana,
            sesion: sesion,
            grupo: grupo.grupo, 
            tipoGrupo: grupo.tipoGrupo,
            horario: horario, 
            participantes: course.participantes.map((usuario) => ({
              participante: usuario.codigo,
              nombre: usuario.nombre, // Ahora añadimos el nombre del participante
              asistencia: {
                estado: faker.helpers.arrayElement(["Presente", "Ausente"]),
                hora: faker.date.recent(),
              },
              participacion: {
                comentario: faker.lorem.sentence(),
                fecha: faker.date.recent(),
              },
            })),
          });
        }
      }
    });
  });

  return sessions;
};


// Generar semanas, basándonos en las sesiones ya generadas
const generateWeeks = (sessions) => {
  const weeks = [];
  let sessionIndex = 0;

  // Para cada curso, crear 16 semanas, cada una con las sesiones generadas
  for (let i = 0; i < 16; i++) {
    const sesionesDeLaSemana = [];

    // Asignamos las sesiones correspondientes a cada semana
    while (sessionIndex < sessions.length && sessions[sessionIndex].semana === i + 1) {
      sesionesDeLaSemana.push(sessions[sessionIndex]);
      sessionIndex++;
    }

    weeks.push({
      semana: i + 1, // Número de semana
      sesiones: sesionesDeLaSemana,
      fecha: {
        inicio: faker.date.past(),
        fin: faker.date.future(),
      },
    });
  }

  return weeks;
};

// Generar los datos completos
const generateData = () => {
  const usuarios = generateUsers();
  const courses = generateCourses(usuarios);
  const sessions = generateSessions(courses);
  const weeks = generateWeeks(sessions);

  return {
    usuarios,
    cursos: courses,
    sesiones: sessions,
    semanas: weeks,
  };
};

// Exportar los datos generados de manera individual
export const { usuarios, cursos, sesiones, semanas } = generateData();
