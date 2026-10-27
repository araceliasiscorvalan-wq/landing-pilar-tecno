import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

import {
  obtenerTareaPorId,
  editarTarea,
} from "../services/tareasService";

type Prioridad = "alta" | "media" | "baja";

interface ValoresFormulario {
  titulo: string;
  descripcion: string;
  prioridad: Prioridad;
  fechaLimite: string;
}

const esquemaValidacion = Yup.object({
  titulo: Yup.string()
    .trim()
    .required("El título es obligatorio")
    .min(3, "El título debe tener al menos 3 caracteres"),

  descripcion: Yup.string(),

  prioridad: Yup.string()
    .oneOf(["alta", "media", "baja"])
    .required("Seleccioná una prioridad"),

  fechaLimite: Yup.string(),
});

function EditarTarea() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [datosIniciales, setDatosIniciales] =
    useState<ValoresFormulario>({
      titulo: "",
      descripcion: "",
      prioridad: "media",
      fechaLimite: "",
    });

  // Cargar los datos de la tarea que queremos editar
  useEffect(() => {
    const cargarTarea = async () => {
      if (!id) {
        setError("No se encontró el identificador de la tarea.");
        setCargando(false);
        return;
      }

      try {
        const tarea = await obtenerTareaPorId(id);

        setDatosIniciales({
          titulo: tarea.titulo,
          descripcion: tarea.descripcion || "",
          prioridad: tarea.prioridad,
          fechaLimite: tarea.fechaLimite
            ? tarea.fechaLimite.substring(0, 10)
            : "",
        });
      } catch (error) {
        console.error("Error al cargar la tarea:", error);
        setError("No se pudo cargar la tarea.");
      } finally {
        setCargando(false);
      }
    };

    cargarTarea();
  }, [id]);

  const formik = useFormik<ValoresFormulario>({
    initialValues: datosIniciales,
    enableReinitialize: true,

    validationSchema: esquemaValidacion,

    onSubmit: async (valores) => {
      if (!id) {
        setError("No se encontró el identificador de la tarea.");
        return;
      }

      try {
        setError("");

        await editarTarea(id, {
          titulo: valores.titulo.trim(),
          descripcion: valores.descripcion,
          prioridad: valores.prioridad,
          fechaLimite: valores.fechaLimite || null,
        });

        navigate("/tareas");
      } catch (error) {
        console.error("Error al editar la tarea:", error);
        setError("No se pudieron guardar los cambios.");
      }
    },
  });

  if (cargando) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" />
        <p>Cargando tarea...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Editar tarea</h1>

      <p>Modificá los datos y guardá los cambios.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={formik.handleSubmit} noValidate>
        {/* Título */}
        <Form.Group className="mb-3">
          <Form.Label>Título de la tarea</Form.Label>

          <Form.Control
            type="text"
            name="titulo"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              Boolean(formik.touched.titulo) &&
              Boolean(formik.errors.titulo)
            }
          />

          <Form.Control.Feedback type="invalid">
            {formik.errors.titulo}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Descripción */}
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>

          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Group>

        {/* Prioridad */}
        <Form.Group className="mb-3">
          <Form.Label>Prioridad</Form.Label>

          <Form.Select
            name="prioridad"
            value={formik.values.prioridad}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              Boolean(formik.touched.prioridad) &&
              Boolean(formik.errors.prioridad)
            }
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </Form.Select>

          <Form.Control.Feedback type="invalid">
            {formik.errors.prioridad}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Fecha límite */}
        <Form.Group className="mb-4">
          <Form.Label>Fecha límite (opcional)</Form.Label>

          <Form.Control
            type="date"
            name="fechaLimite"
            value={formik.values.fechaLimite}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Form.Group>

        {/* Botones */}
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            type="submit"
            disabled={formik.isSubmitting || Boolean(error)}
          >
            {formik.isSubmitting
              ? "Guardando..."
              : "Guardar cambios"}
          </Button>

          <Link to="/tareas" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default EditarTarea;