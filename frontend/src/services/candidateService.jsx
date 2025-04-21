// CandidateService.js
import axios from "axios";

const API_URL = "https://localhost:7129/api/Candidate";

export const getCandidates = async () => {
  try {
    const response = await axios.get(`${API_URL}/Get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidates:", error);
    throw error;
  }
};

export const createCandidate = async (candidateData) => {
  try {
    const response = await axios.post(`${API_URL}/Create`, candidateData, {});

    return response.data;
  } catch (error) {
    console.error("Error creating candidate:", error);
    throw error;
  }
};

// Delete a candidate
export const deleteCandidate = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/Delete/${id}`, {
      headers: {
        "Content-Type": "application/json", // ✅ Ensure correct header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting candidate:", error);
    throw error;
  }
};

// Update a company
export const updateCandidate = async (id, jobData) => {
  try {
    const response = await axios.put(`${API_URL}/Update/${id}`, jobData, {});
    return response.data;
  } catch (error) {
    console.error("Error updating candidate:", error);
    throw error;
  }
};

export const getCandidateById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/Get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    throw error;
  }
};
