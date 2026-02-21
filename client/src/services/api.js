import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Resume API calls
export const resumeAPI = {
  // Create a new resume
  createResume: async (resumeData) => {
    try {
      const response = await api.post('/resume/create', resumeData);
      return response.data;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw error;
    }
  },

  // Get a resume by ID
  getResume: async (id) => {
    try {
      const response = await api.get(`/resume/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw error;
    }
  },

  // Update a resume
  updateResume: async (id, resumeData) => {
    try {
      const response = await api.put(`/resume/update/${id}`, resumeData);
      return response.data;
    } catch (error) {
      console.error('Error updating resume:', error);
      throw error;
    }
  },

  // Get all resumes
  getAllResumes: async () => {
    try {
      const response = await api.get('/resume');
      return response.data;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw error;
    }
  },

  // Delete a resume
  deleteResume: async (id) => {
    try {
      const response = await api.delete(`/resume/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw error;
    }
  }
};

// AI Enhancement API calls
export const aiAPI = {
  // Enhance a bullet point using Groq AI
  enhanceBullet: async (text) => {
    try {
      const response = await api.post('/resume/enhance', { text });
      return response.data;
    } catch (error) {
      console.error('Error enhancing bullet:', error);
      throw error;
    }
  }
};

// ATS Score API calls
export const atsAPI = {
  // Calculate ATS score
  calculateScore: async (resumeText, jobDescription) => {
    try {
      const response = await api.post('/resume/ats-score', {
        resumeText,
        jobDescription
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating ATS score:', error);
      throw error;
    }
  }
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};

export default api;
