import axios from 'axios';

// Get base URL from environment variables
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Fetch board items from the server
export const fetchBoardItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/board`, { withCredentials: true });
    // Ensure the response data contains the 'data' field
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching board items:', error);
    return [];
  }
};

// Create a new board item
export const createBoardItem = async (item) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/board`, item, { withCredentials: true });
    return response.data.data || response.data; // Extract the 'data' field
  } catch (error) {
    console.error('Error creating board item:', error);
    throw error;
  }
};

// Update a board item
export const updateBoardItem = (item) => axios.put(`${API_BASE_URL}/api/board/${item.bidx}`, item, { withCredentials: true });

// Delete a board item
export const deleteBoardItem = async (bIdx) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/board/${bIdx}`, { withCredentials: true });
  } catch (error) {
    console.error('Error deleting board item:', error);
    throw error;
  }
};
