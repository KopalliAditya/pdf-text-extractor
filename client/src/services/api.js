// api.js
import axios from 'axios';

// Example API methods
export const getSamples = async () => {
  try {
    const response = await axios.get('/api/samples');
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('API Error');
  }
};

export const createSample = async (name) => {
  try {
    const response = await axios.post('/api/samples', { name });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error('API Error');
  }
};