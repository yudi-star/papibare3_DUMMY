

import axios from 'axios';


const API_BASE_URL = 'https://dummyjson.com';


export const getProducts = async () => {
  try {
   
    const response = await axios.get(`${API_BASE_URL}/products`);
    
    return response.data.products;
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error; 
    
  }
};


export const getCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/products/categories`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw error;
    }
};




























