
import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import BarraNavegacion from "./components/BarraNavegacion/BarraNavegacion";
import BotonColor from "./components/BotonColor/BotonColor";

function App() {
  const [colorTitulo, setColorTitulo] = useState("#1B2A4A");

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
            {/* acá van los cursos, más adelante */}
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
