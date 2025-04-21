import axios from "axios";

const API_URL = "https://localhost:7129/api/Company"; // Replace with your actual API URL
// Get all companies
export const getCompanies = async () => {
  try {
    const response = await axios.get(`${API_URL}/Get`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompaniesSize = async () => {
  try {
    const response = await axios.get(`${API_URL}/sizes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies size:", error);
    throw error;
  }
};

export const getCompaniesProvince = async () => {
  try {
    const response = await axios.get(`${API_URL}/provinces`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

//Create a new company
export const createCompany = async (companyData) => {
  try {
    const response = await axios.post(`${API_URL}/Create`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

// // Update a company
export const updateCompany = async (id, companyData) => {
  try {
    const response = await axios.put(`${API_URL}/Update/${id}`, companyData);
    return response.data;
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

// Delete a company
export const deleteCompany = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/Delete/${id}`, {
      headers: {
        "Content-Type": "application/json", // ✅ Ensure correct header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};
