import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 90000, // 90s for AI processing
});

export const imageService = {
  // Upload image for background removal
  upload: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    });
  },

  // Get all processed images
  getAll: () => api.get('/images'),

  // Get single image by ID
  getById: (id) => api.get(`/images/${id}`),

  // Delete an image
  delete: (id) => api.delete(`/images/${id}`),

  // Get dashboard stats
  getStats: () => api.get('/images/stats'),

  // Get download URL
  getDownloadUrl: (id, format = 'png') => `/api/images/${id}/download?format=${format}`,
};

export default api;
