import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <BSNavbar bg="dark" variant="dark" expand="lg">
        <Container>
          <BSNavbar.Brand as={Link} to="/">
            DUMMY API
          </BSNavbar.Brand>

          <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

          <BSNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Inicio
              </Nav.Link>
              <Nav.Link as={Link} to="/api-data">
                ver contenido
              </Nav.Link>
            </Nav>
          </BSNavbar.Collapse>
        </Container>
      </BSNavbar>
    </header>
  );
}

export default Header;