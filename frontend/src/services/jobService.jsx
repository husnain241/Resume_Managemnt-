import axios from "axios";

const API_URL = "https://localhost:7129/api/Job"; // Replace with your actual API URL
// Get all companies
export const getJobs = async () => {
  try {
    const response = await axios.get(`${API_URL}/Get`);

    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    throw error;
  }
};

export const getJobsLevel = async () => {
  try {
    const response = await axios.get(`${API_URL}/levels`);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs level:", error);
    throw error;
  }
};

//Create a new company
export const createJob = async (jobData) => {
  try {
    const response = await axios.post(`${API_URL}/Create`, jobData);
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};

// Update a company
export const updateJob = async (id, jobData) => {
  try {
    const response = await axios.put(`${API_URL}/Update/${id}`, jobData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    throw error;
  }
};

// Delete a company
export const deleteJob = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/Delete/${id}`, {
      headers: {
        "Content-Type": "application/json", // ✅ Ensure correct header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};
