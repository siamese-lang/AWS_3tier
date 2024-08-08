import axios from 'axios';

// Fetch board items from the server
export const fetchBoardItems = async () => {
  try {
    const response = await axios.get('/api/board');
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
    const response = await axios.post('/api/board', item);
    return response.data.data || response.data; // Extract the 'data' field
  } catch (error) {
    console.error('Error creating board item:', error);
    throw error;
  }
};

export const updateBoardItem = (item) => axios.put(`/api/board/${item.bidx}`, item);

// Delete a board item
export const deleteBoardItem = async (bIdx) => {
  try {
    await axios.delete(`/api/board/${bIdx}`);
  } catch (error) {
    console.error('Error deleting board item:', error);
    throw error;
  }
};
