import { faker } from '@faker-js/faker';

// Definimos las carreras posibles para cada facultad
const carrerasPorFacultad = {
  ingenieria: [
    "Informática",
    "Civil",
    "Industrial",
    "Electrónica",
    "Mecatrónica",
  ],
  derecho: ["Derecho"],
  arquitectura: ["Arquitectura"],
  cienciasEconomicas: [
    "Economía",
    "Administración de Empresas",
    "Contabilidad",
  ],
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
    const facultad = faker.helpers.arrayElement(facultades);  // Cambiado a faker.helpers.arrayElement
    const carrera = faker.helpers.arrayElement(carrerasPorFacultad[facultad]);  // Cambiado a faker.helpers.arrayElement
    users.push({
      nombre: faker.name.fullName(),  // Cambiado de findName() a fullName()
      facultad: facultad,
      carrera: carrera,
      ciclo: faker.number.int({ min: 1, max: 10 }).toString(),  // Cambiado a faker.number.int()
      codigo: faker.string.uuid(),  // Cambiado de faker.datatype.uuid() a faker.string.uuid()
      correo: faker.internet.email(),
      password: faker.internet.password(),
      role: "estudiante", // O "profesor", según el caso
    });
  }
  return users;
};

// Generar 40 cursos
const generateCourses = (users) => {
  const courses = [];
  for (let i = 0; i < 40; i++) {
    const facultades = Object.keys(carrerasPorFacultad);
    const facultad = faker.helpers.arrayElement(facultades);  // Cambiado a faker.helpers.arrayElement
    const carrera = faker.helpers.arrayElement(carrerasPorFacultad[facultad]);  // Cambiado a faker.helpers.arrayElement
    const semestre = faker.helpers.arrayElement(["Primero", "Segundo"]);  // Cambiado a faker.helpers.arrayElement
    courses.push({
      nombre: `Curso ${faker.commerce.productName()}`,
      codigo: faker.string.uuid(),  // Cambiado de faker.datatype.uuid() a faker.string.uuid()
      grado: faker.helpers.arrayElement(["Básico", "Intermedio", "Avanzado"]),  // Cambiado a faker.helpers.arrayElement
      carrera: carrera,
      facultad: facultad,
      ciclo: faker.number.int({ min: 1, max: 10 }),  // Cambiado a faker.number.int()
      semestre: semestre,
      grupos: [
        {
          grupo: 1,
          tipoGrupo: "Teórico",
          horario: [
            { dia: "Lunes", hora: "08:00 AM" },
            { dia: "Miércoles", hora: "08:00 AM" },
          ],
          participantes: users.slice(0, 10),
        },
        {
          grupo: 2,
          tipoGrupo: "Práctico",
          horario: [
            { dia: "Martes", hora: "10:00 AM" },
            { dia: "Jueves", hora: "10:00 AM" },
          ],
          participantes: users.slice(10, 20),
        },
      ],
    });
  }
  return courses;
};

// Generar 40 sesiones
const generateSessions = (courses) => {
  const sessions = [];
  courses.forEach((course) => {
    course.grupos.forEach((grupo) => {
      for (let i = 0; i < 10; i++) {
        const fecha = faker.date.future();
        sessions.push({
          tema: `Tema de sesión ${i + 1}`,
          fecha: fecha,
          participantes: grupo.participantes.map((usuario) => ({
            participante: usuario.codigo,
            asistencia: {
              estado: faker.helpers.arrayElement(["Presente", "Ausente"]),  // Cambiado a faker.helpers.arrayElement
              hora: faker.date.recent(),
            },
            participacion: {
              comentario: faker.lorem.sentence(),
              fecha: faker.date.recent(),
            },
          })),
        });
      }
    });
  });
  return sessions;
};

// Generar 40 semanas
const generateWeeks = (sessions) => {
  const weeks = [];
  for (let i = 0; i < 40; i++) {
    weeks.push({
      sesiones: sessions.slice(i * 10, (i + 1) * 10),
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


