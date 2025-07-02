
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { getProducts, getCategories } from '../services/apiService'; 
import { Heart, HeartFill } from 'react-bootstrap-icons'; 


function ProductsPage() {
  const [allProducts, setAllProducts] = useState([]); 
  const [filteredProducts, setFilteredProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all'); 

  const [favoriteProductIds, setFavoriteProductIds] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const productsData = await getProducts();
        setAllProducts(productsData); 
        setFilteredProducts(productsData); 

        const categoriesData = await getCategories();
        setCategories(['all', ...categoriesData]); // Añade 'all' al inicio

        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    loadData();
  }, []); // Se ejecuta solo una vez al montar

  // Efecto para aplicar filtro y búsqueda cuando cambian los estados
  useEffect(() => {
    let latestFiltered = allProducts;

    // 1. Filtrar por categoría
    if (selectedCategory !== 'all') {
      latestFiltered = latestFiltered.filter(
        product => product.category === selectedCategory
      );
    }

    // 2. Filtrar por término de búsqueda (en título o categoría)
    if (searchTerm) {
      latestFiltered = latestFiltered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase()) // Opcional: buscar también en categoría
      );
    }

    setFilteredProducts(latestFiltered);

  }, [allProducts, searchTerm, selectedCategory]); // Se ejecuta cuando cambian estos estados

  // Manejar el toggle de favoritos
  const toggleFavorite = (productId) => {
    setFavoriteProductIds(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        // Si ya está en favoritos, quítalo
        return prevFavorites.filter(id => id !== productId);
      } else {
        // Si no está, añádelo
        return [...prevFavorites, productId];
      }
    });
  };

  // Estados de carga y error
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  // Si no hay productos para mostrar después de filtros
  if (filteredProducts.length === 0 && !loading && !error) {
      return (
          <Container className="my-5 text-center">
              <Alert variant="info">
                  No se encontraron productos que coincidan con los criterios.
              </Alert>
          </Container>
      );
  }


  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Catálogo de Productos</h2>

      {/* Formulario de búsqueda y filtro */}
      <Row className="mb-4">
        <Col md={6} className="mb-3 mb-md-0">
          <Form.Control
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            aria-label="Filtrar por categoría"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Todas las Categorías' : category.charAt(0).toUpperCase() + category.slice(1)} 
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>


      {/* Lista de productos */}
      <Row xs={1} md={2} lg={3} xl={4} className="g-4"> 
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <Card className="h-100"> {/* h-100 para que todas las cards tengan la misma altura */}
              <div style={{ height: '200px', overflow: 'hidden' }}> {/* Contenedor para controlar tamaño de imagen */}
                 {/* Usa la thumbnail que es más pequeña */}
                 <Card.Img variant="top" src={product.thumbnail} alt={product.title} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <Card.Body>
                <Card.Title className="text-truncate">{product.title}</Card.Title> 
                <Card.Text className="mb-1">
                  
                  Rating: {product.rating} ⭐
                </Card.Text>
                <Card.Text className="text-muted">
                   Categoría: {product.category}
                </Card.Text>
                {/* Botón/Ícono de Favorito */}
                <Button
                  variant="outline-danger" // Borde rojo
                  size="sm"
                  onClick={() => toggleFavorite(product.id)}
                  className="position-absolute top-0 end-0 m-2" // Posiciona en la esquina superior derecha
                  style={{ zIndex: 100 }} // Asegura que esté encima de la imagen
                >
                  {/* Cambia el ícono o texto si es favorito */}
                  {favoriteProductIds.includes(product.id) ? <HeartFill color="red" /> : <Heart />}
                </Button>
              </Card.Body>
               <Card.Footer>
                  <small className="text-muted">${product.price.toFixed(2)}</small> {/* Muestra el precio */}
               </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductsPage;