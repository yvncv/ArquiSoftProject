import { Usuario } from "./Usuario";

export type Curso = {
    _id: string;
    nombre: string;
    codigo: string;
    grado: string;
    carrera: string;
    facultad: string;
    semestre: string;
    sesiones: [string];
    participantes: [Usuario];    
}                                                     