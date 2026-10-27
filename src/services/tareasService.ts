import axios from "axios";

// Tipo de datos de una tarea
export interface Tarea {
  _id: string;
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null;
  completada: boolean;
  prioridad: "alta" | "media" | "baja";
  etiquetas: string[];
}

// Datos necesarios para crear o editar una tarea
export interface DatosTarea {
  titulo: string;
  descripcion?: string;
  fechaLimite?: string | null;
  completada?: boolean;
  prioridad?: "alta" | "media" | "baja";
  etiquetas?: string[];
}

// Dirección de nuestra API
const API_URL = "http://localhost:3000/tareas";

// Obtener todas las tareas
export const obtenerTareas = async (): Promise<Tarea[]> => {
  const respuesta = await axios.get<Tarea[]>(API_URL);
  return respuesta.data;
};

// Obtener una tarea por ID
export const obtenerTareaPorId = async (
  id: string
): Promise<Tarea> => {
  const respuesta = await axios.get<Tarea>(`${API_URL}/${id}`);
  return respuesta.data;
};

// Crear una nueva tarea
export const crearTarea = async (
  datos: DatosTarea
): Promise<Tarea> => {
  const respuesta = await axios.post<Tarea>(API_URL, datos);
  return respuesta.data;
};

// Editar una tarea existente
export const editarTarea = async (
  id: string,
  datos: Partial<DatosTarea>
): Promise<Tarea> => {
  const respuesta = await axios.put<Tarea>(
    `${API_URL}/${id}`,
    datos
  );

  return respuesta.data;
};

// Eliminar una tarea
export const eliminarTarea = async (
  id: string
): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Marcar una tarea como completada
export const completarTarea = async (
  id: string
): Promise<Tarea> => {
  const respuesta = await axios.put<Tarea>(
    `${API_URL}/${id}/completar`
  );

  return respuesta.data;
};

// Obtener tareas por prioridad
export const obtenerTareasPorPrioridad = async (
  prioridad: "alta" | "media" | "baja"
): Promise<Tarea[]> => {
  const respuesta = await axios.get<Tarea[]>(
    `${API_URL}/prioridad/${prioridad}`
  );

  return respuesta.data;
};

// Obtener tareas próximas a vencer
export const obtenerTareasProximasAVencer = async (
  dias: number
): Promise<Tarea[]> => {
  const respuesta = await axios.get<Tarea[]>(
    `${API_URL}/proximas-vencer/${dias}`
  );

  return respuesta.data;
};