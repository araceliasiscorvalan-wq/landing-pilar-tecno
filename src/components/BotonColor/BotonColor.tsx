
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

type BotonColorProps = {
  textoBoton: string;
  onColorChange: (color: string) => void;
};

const BotonColor = ({
  textoBoton,
  onColorChange,
}: BotonColorProps) => {
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");
  const [mostrarModal, setMostrarModal] = useState(false);

  const aceptarColor = () => {
    onColorChange(colorTitulo);
    setMostrarModal(false);
  };

  return (
    <>
      <Button onClick={() => setMostrarModal(true)}>
        {textoBoton}
      </Button>

      <Modal
        show={mostrarModal}
        onHide={() => setMostrarModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Elegí un color</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <input
            type="color"
            value={colorTitulo}
            onChange={(e) => setColorTitulo(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setMostrarModal(false)}
          >
            Cancelar
          </Button>

          <Button variant="primary" onClick={aceptarColor}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BotonColor;
