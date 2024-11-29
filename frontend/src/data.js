// data.js
export const usuarios = [
    {
      _id: "1",
      nombre: "Juan Pérez",
      role: "alumno",
      carrera: "Informática",
      ciclo: 1
    },
    {
      _id: "2",
      nombre: "Ana Gómez",
      role: "alumno",
      carrera: "Ingeniería Civil",
      ciclo: 2
    },
    // ... más usuarios
  ];
  // data.js
export const usuariosData = [
  { id: "1", nombre: "Juan Pérez", codigo: "001", role: "estudiante" },
  { id: "2", nombre: "Ana Gómez", codigo: "002", role: "profesor" },
  { id: "3", nombre: "Carlos Sánchez", codigo: "003", role: "estudiante" },
  // Agrega más usuarios según sea necesario
];

export const semanasData = [
  {
    id: "1",
    sesiones: [
      { _id: "s1", tema: "Sesión 1", fecha: "2024-11-01", participantes: [] },
      { _id: "s2", tema: "Sesión 2", fecha: "2024-11-02", participantes: [] },
      // Agrega más sesiones según sea necesario
    ],
  },
  {
    id: "2",
    sesiones: [
      { _id: "s3", tema: "Sesión 3", fecha: "2024-11-08", participantes: [] },
      { _id: "s4", tema: "Sesión 4", fecha: "2024-11-09", participantes: [] },
    ],
  },
  // Agrega más semanas según sea necesario
];

export const asistenciasData = [
  { tema: "Sesión 1", fecha: "2024-11-01", asistencia: { estado: "presente", hora: "10:00" } },
  { tema: "Sesión 2", fecha: "2024-11-02", asistencia: { estado: "falta", hora: "N/A" } },
  // Agrega más asistencias según sea necesario
];

export const participacionesData = [
  { tema: "Sesión 1", fecha: "2024-11-01", participacion: { comentario: "Participó activamente", fecha: "2024-11-01" } },
  { tema: "Sesión 2", fecha: "2024-11-02", participacion: { comentario: "No participó", fecha: "2024-11-02" } },
  // Agrega más participaciones según sea necesario
];

  export const cursos = [
    {
      _id: "101",
      nombre: "Programación 1",
      codigo: "INF101",
      grado: "Pregrado",
      carrera: "Informática",
      facultad: "Ingeniería",
      ciclo: 1,
      semestre: "2024-I",
      grupos: [
        {
          tipoGrupo: "Teoría",
          horario: [{ dia: "Lunes", hora: "08:00" }],
          participantes: ["1", "2"],
          sesiones: []
        }
      ]
    },
    {
      _id: "102",
      nombre: "Matemáticas 1",
      codigo: "MAT101",
      grado: "Pregrado",
      carrera: "Ingeniería Civil",
      facultad: "Ingeniería",
      ciclo: 1,
      semestre: "2024-I",
      grupos: []
    },
    // ... más cursos
  ];
  