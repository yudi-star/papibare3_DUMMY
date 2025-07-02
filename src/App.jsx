import { Routes, Route } from 'react-router-dom'
import Header from './components/Header' 
import HomePage from './pages/HomePage' 
import ProductsPage from './pages/ProductsPage'
 


function App() {
  return (
    <>
      <Header /> 
      <main> 
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/api-data" element={<ProductsPage />} /> 
          
          
        </Routes>
      </main>
      
      
    </>
  )
}

export default App