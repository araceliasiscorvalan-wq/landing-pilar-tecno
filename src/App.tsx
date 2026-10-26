import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import BotonColor from "./components/BotonColor/BotonColor";
import { obtenerTareas } from "./services/tareasService";
import type { Tarea } from "./services/tareasService";

function App() {
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const datos = await obtenerTareas();
        setTareas(datos);
      } catch (error) {
        console.error("Error al obtener las tareas:", error);
        setError("No se pudieron cargar las tareas.");
      } finally {
        setCargando(false);
      }
    };

    cargarTareas();
  }, []);

  return (
    <>
      <BarraNavegacion nombre="Pilar Tecno" />

      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <h1 style={{ color: colorTitulo }}>Pilar tecno</h1>

            <p>Bienvenido al curso de React</p>

            <BotonColor
              textoBoton="Personalizar"
              onColorChange={setColorTitulo}
            />
          </Col>

          <Col md={6}>
            <h2>Lista de tareas</h2>

            {cargando && <p>Cargando tareas...</p>}

            {error && <p className="text-danger">{error}</p>}

            {!cargando && !error && tareas.length === 0 && (
              <p>No hay tareas registradas.</p>
            )}

            {!cargando && !error && tareas.map((tarea) => (
              <div key={tarea._id} className="border rounded p-3 mb-3">
                <h4>{tarea.titulo}</h4>

                <p>{tarea.descripcion}</p>

                <p>
                  <strong>Prioridad:</strong> {tarea.prioridad}
                </p>

                <p>
                  <strong>Estado:</strong>{" "}
                  {tarea.completada ? "Completada" : "Pendiente"}
                </p>
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;