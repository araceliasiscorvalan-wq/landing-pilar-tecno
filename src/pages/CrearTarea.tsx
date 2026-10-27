import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Container, Form, Button, Alert } from "react-bootstrap";

import { crearTarea } from "../services/tareasService";

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

function CrearTarea() {
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const formik = useFormik<ValoresFormulario>({
    initialValues: {
      titulo: "",
      descripcion: "",
      prioridad: "media",
      fechaLimite: "",
    },

    validationSchema: esquemaValidacion,

    onSubmit: async (valores) => {
      try {
        setError("");

        await crearTarea({
          titulo: valores.titulo.trim(),
          descripcion: valores.descripcion,
          prioridad: valores.prioridad,
          fechaLimite: valores.fechaLimite || null,
          completada: false,
          etiquetas: [],
        });

        navigate("/tareas");
      } catch (error) {
        console.error("Error al crear la tarea:", error);
        setError("No se pudo crear la tarea. Intentá nuevamente.");
      }
    },
  });

  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Crear nueva tarea</h1>

      <p>Completá el formulario para agregar una tarea.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={formik.handleSubmit} noValidate>
        {/* Título */}
        <Form.Group className="mb-3">
          <Form.Label>Título de la tarea</Form.Label>

          <Form.Control
            type="text"
            name="titulo"
            placeholder="Ejemplo: Estudiar React"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.titulo && Boolean(formik.errors.titulo)
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
            placeholder="Escribí una descripción..."
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
              formik.touched.prioridad &&
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
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting
              ? "Guardando..."
              : "Guardar tarea"}
          </Button>

          <Link to="/tareas" className="btn btn-secondary">
            Cancelar
          </Link>
        </div>
      </Form>
    </Container>
  );
}

export default CrearTarea;