import axios from "axios";

export interface Tarea {
  _id: string;
  titulo: string;
  descripcion?: string;
  fechaLimite?: string;
  completada: boolean;
  prioridad: "alta" | "media" | "baja";
  etiquetas: string[];
}

const API_URL = "http://localhost:3000/tareas";

export const obtenerTareas = async (): Promise<Tarea[]> => {
  const respuesta = await axios.get<Tarea[]>(API_URL);
  return respuesta.data;
};