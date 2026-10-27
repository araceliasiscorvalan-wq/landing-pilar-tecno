
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Spinner,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";

import {
  obtenerTareas,
  completarTarea,
  eliminarTarea,
} from "../services/tareasService";

import type { Tarea } from "../services/tareasService";

type FiltroPrioridad = "todas" | "alta" | "media" | "baja";
type FiltroFecha = "todas" | "proximas" | "vencidas" | "sin-fecha";

function ListadoTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [procesandoId, setProcesandoId] = useState<string | null>(null);

  const [tareaAEliminar, setTareaAEliminar] = useState<Tarea | null>(null);
  const [eliminando, setEliminando] = useState(false);

  const [filtroPrioridad, setFiltroPrioridad] =
    useState<FiltroPrioridad>("todas");
  const [filtroFecha, setFiltroFecha] =
    useState<FiltroFecha>("todas");

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        setError("");
        const datos = await obtenerTareas();
        setTareas(datos);
      } catch (error) {
        console.error("Error al cargar tareas:", error);
        setError("No se pudieron cargar las tareas.");
      } finally {
        setCargando(false);
      }
    };

    cargarTareas();
  }, []);

  const tareasFiltradas = useMemo(() => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const limiteProximas = new Date(hoy);
    limiteProximas.setDate(limiteProximas.getDate() + 7);

    return tareas.filter((tarea) => {
      if (
        filtroPrioridad !== "todas" &&
        tarea.prioridad !== filtroPrioridad
      ) {
        return false;
      }

      if (filtroFecha === "todas") return true;
      if (!tarea.fechaLimite) return filtroFecha === "sin-fecha";

      const fecha = new Date(tarea.fechaLimite);
      if (Number.isNaN(fecha.getTime())) return false;
      fecha.setHours(0, 0, 0, 0);

      if (filtroFecha === "vencidas") {
        return fecha < hoy && !tarea.completada;
      }

      if (filtroFecha === "proximas") {
        return (
          fecha >= hoy &&
          fecha <= limiteProximas &&
          !tarea.completada
        );
      }

      return false;
    });
  }, [tareas, filtroPrioridad, filtroFecha]);

  const manejarCompletar = async (id: string) => {
    try {
      setError("");
      setProcesandoId(id);

      const tareaActualizada = await completarTarea(id);

      setTareas((anteriores) =>
        anteriores.map((tarea) =>
          tarea._id === id ? tareaActualizada : tarea
        )
      );
    } catch (error) {
      console.error("Error al completar tarea:", error);
      setError("No se pudo completar la tarea.");
    } finally {
      setProcesandoId(null);
    }
  };

  const manejarEliminar = async () => {
    if (!tareaAEliminar) return;

    const id = tareaAEliminar._id;

    try {
      setError("");
      setEliminando(true);

      await eliminarTarea(id);

      setTareas((anteriores) =>
        anteriores.filter((tarea) => tarea._id !== id)
      );

      setTareaAEliminar(null);
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      setError("No se pudo eliminar la tarea.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Container className="mt-4 mb-5">
      <div className="text-center mb-4">
        <h1>Mis tareas 🌸</h1>
        <p>Organizá tus actividades y hacé florecer tus objetivos.</p>

        <Link to="/tareas/nueva" className="btn btn-primary">
          + Crear nueva tarea
        </Link>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-3">Organizá tus tareas ✨</h5>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Filtrar por prioridad</Form.Label>
              <Form.Select
                value={filtroPrioridad}
                onChange={(e) =>
                  setFiltroPrioridad(e.target.value as FiltroPrioridad)
                }
              >
                <option value="todas">Todas las prioridades</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </Form.Select>
            </Col>

            <Col md={6} className="mb-3">
              <Form.Label>Filtrar por vencimiento</Form.Label>
              <Form.Select
                value={filtroFecha}
                onChange={(e) =>
                  setFiltroFecha(e.target.value as FiltroFecha)
                }
              >
                <option value="todas">Todas las fechas</option>
                <option value="proximas">
                  Próximas a vencer (7 días)
                </option>
                <option value="vencidas">Vencidas pendientes</option>
                <option value="sin-fecha">Sin fecha límite</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
            <span>
              Mostrando {tareasFiltradas.length} de {tareas.length} tareas
            </span>

            <Button
              variant="outline-primary"
              onClick={() => {
                setFiltroPrioridad("todas");
                setFiltroFecha("todas");
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        </Card.Body>
      </Card>

      {cargando && (
        <div className="text-center my-5">
          <Spinner animation="border" />
          <p className="mt-2">Cargando tareas...</p>
        </div>
      )}

      {!cargando && tareas.length === 0 && (
        <Alert variant="info">
          Todavía no hay tareas. ¡Creá la primera! 🌷
        </Alert>
      )}

      {!cargando &&
        tareas.length > 0 &&
        tareasFiltradas.length === 0 && (
          <Alert variant="info">
            No hay tareas que coincidan con los filtros seleccionados.
          </Alert>
        )}

      {!cargando && tareasFiltradas.length > 0 && (
        <Row>
          {tareasFiltradas.map((tarea) => (
            <Col
              md={6}
              lg={4}
              key={tarea._id}
              className="mb-4"
            >
              <Card className="h-100">
                <Card.Body>
                  <Card.Title>{tarea.titulo}</Card.Title>

                  <Card.Text>
                    {tarea.descripcion || "Sin descripción"}
                  </Card.Text>

                  <p>
                    <strong>Prioridad: </strong>
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      style={{
                        backgroundColor:
                          tarea.prioridad === "alta"
                            ? "#FBE3EC"
                            : tarea.prioridad === "media"
                            ? "#FFF0CE"
                            : "#E3F3E8",
                        color:
                          tarea.prioridad === "alta"
                            ? "#AD5279"
                            : tarea.prioridad === "media"
                            ? "#956B28"
                            : "#477D60",
                      }}
                    >
                      {tarea.prioridad}
                    </Badge>
                  </p>

                  <p>
                    <strong>Estado: </strong>
                    <Badge
                      pill
                      bg="light"
                      text="dark"
                      style={{
                        backgroundColor: tarea.completada
                          ? "#E3F3E8"
                          : "#ECE5FA",
                        color: tarea.completada
                          ? "#477D60"
                          : "#7960A9",
                      }}
                    >
                      {tarea.completada ? "Completada" : "Pendiente"}
                    </Badge>
                  </p>

                  <p>
                    <strong>Fecha límite: </strong>
                    {tarea.fechaLimite
                      ? new Date(
                          tarea.fechaLimite
                        ).toLocaleDateString("es-AR")
                      : "Sin fecha límite"}
                  </p>

                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Link
                      to={`/tareas/${tarea._id}`}
                      className="btn btn-outline-primary"
                    >
                      Ver detalle
                    </Link>

                    <Link
                      to={`/tareas/editar/${tarea._id}`}
                      className="btn btn-primary"
                    >
                      Editar
                    </Link>

                    {!tarea.completada && (
                      <Button
                        variant="success"
                        disabled={procesandoId === tarea._id}
                        onClick={() => manejarCompletar(tarea._id)}
                      >
                        {procesandoId === tarea._id
                          ? "Completando..."
                          : "Marcar como completada"}
                      </Button>
                    )}

                    <Button
                      variant="danger"
                      disabled={eliminando}
                      onClick={() => setTareaAEliminar(tarea)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        show={tareaAEliminar !== null}
        onHide={() => {
          if (!eliminando) setTareaAEliminar(null);
        }}
        centered
        backdrop={eliminando ? "static" : true}
        keyboard={!eliminando}
      >
        <Modal.Header closeButton={!eliminando}>
          <Modal.Title>Confirmar eliminación 🌸</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Estás segura de que querés eliminar{" "}
          <strong>{tareaAEliminar?.titulo}</strong>?

          <p className="text-danger mt-3 mb-0">
            Esta acción no se puede deshacer.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setTareaAEliminar(null)}
            disabled={eliminando}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={manejarEliminar}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Sí, eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ListadoTareas;
