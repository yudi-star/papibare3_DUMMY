import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form } from 'react-bootstrap';
import { getProducts, getCategories } from '../services/apiService';
import { Heart, HeartFill } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';



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
        setCategories(['all', ...categoriesData]);

        setLoading(false);
      } catch (err) {
        console.error("Failed to load data:", err);
        setError('No se pudieron cargar los datos. Por favor, intenta de nuevo.');
        setLoading(false);
      }
    };

    loadData();
  }, []);


  useEffect(() => {
    let latestFiltered = allProducts;

    if (selectedCategory !== 'all') {
      latestFiltered = latestFiltered.filter(
        product => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      latestFiltered = latestFiltered.filter(
        product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(latestFiltered);

  }, [allProducts, searchTerm, selectedCategory]);


  const toggleFavorite = (productId) => {
    setFavoriteProductIds(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

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


      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filteredProducts.map(product => (
          <Col key={product.id}>
            <Card className="h-100">
              <div style={{ height: '200px', overflow: 'hidden' }}>
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
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => toggleFavorite(product.id)}
                  className="position-absolute top-0 end-0 m-2"
                  style={{ zIndex: 100 }}
                >
                  {favoriteProductIds.includes(product.id) ? <HeartFill color="red" /> : <Heart />}
                </Button>
              </Card.Body>
               <Card.Footer>
                  <small className="text-muted">${product.price.toFixed(2)}</small>
               </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductsPage;