import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Container,
  Card,
  Badge,
  Alert,
  Spinner,
} from "react-bootstrap";

import { obtenerTareaPorId } from "../services/tareasService";
import type { Tarea } from "../services/tareasService";

function DetalleTarea() {
  const { id } = useParams<{ id: string }>();

  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTarea = async () => {
      if (!id) {
        setError("No se encontró el identificador de la tarea.");
        setCargando(false);
        return;
      }

      try {
        const datos = await obtenerTareaPorId(id);
        setTarea(datos);
      } catch (error) {
        console.error("Error al obtener la tarea:", error);
        setError("No se pudo cargar el detalle de la tarea.");
      } finally {
        setCargando(false);
      }
    };

    cargarTarea();
  }, [id]);

  if (cargando) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando detalle...</p>
      </Container>
    );
  }

  if (error || !tarea) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error || "No se encontró la tarea."}
        </Alert>

        <Link to="/tareas" className="btn btn-secondary">
          Volver al listado
        </Link>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5">
      <h1 className="mb-4">Detalle de la tarea</h1>

      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{tarea.titulo}</h4>
        </Card.Header>

        <Card.Body>
          <h5>Descripción</h5>

          <p>{tarea.descripcion || "Sin descripción"}</p>

          <hr />

          <p>
            <strong>Prioridad: </strong>

            <Badge
              bg={
                tarea.prioridad === "alta"
                  ? "danger"
                  : tarea.prioridad === "media"
                  ? "warning"
                  : "success"
              }
            >
              {tarea.prioridad}
            </Badge>
          </p>

          <p>
            <strong>Estado: </strong>

            <Badge
              bg={tarea.completada ? "success" : "secondary"}
            >
              {tarea.completada
                ? "Completada"
                : "Pendiente"}
            </Badge>
          </p>

          <p>
            <strong>Fecha límite: </strong>

            {tarea.fechaLimite
              ? new Date(tarea.fechaLimite).toLocaleDateString(
                  "es-AR"
                )
              : "Sin fecha límite"}
          </p>

          <p>
            <strong>Etiquetas: </strong>

            {tarea.etiquetas?.length > 0
              ? tarea.etiquetas.join(", ")
              : "Sin etiquetas"}
          </p>

          <hr />

          <div className="d-flex gap-2">
            <Link
              to="/tareas"
              className="btn btn-secondary"
            >
              Volver
            </Link>

            <Link
              to={`/tareas/editar/${tarea._id}`}
              className="btn btn-primary"
            >
              Editar tarea
            </Link>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default DetalleTarea;