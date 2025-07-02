import { Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom' 
import '../styles/HomePage.css'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="hero-banner">
      <div className="hero-overlay">
        <Container className="text-center text-white d-flex flex-column justify-content-center align-items-center h-100">
          <h1 className="display-4 fw-bold">DUMMY API</h1>
          <p className="lead mb-4">Inicio</p>
          
          <Button variant="light" size="lg" onClick={() => navigate('/api-data')}>
            Contenido
          </Button>
        </Container>
      </div>
    </div>
  )
}

export default HomePage