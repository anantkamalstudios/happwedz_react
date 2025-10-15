// Photography API service
import axios from "axios";

const BASE_URL = "https://happywedz.com/api";

// Get main photography types
export const getPhotographyTypes = async () => {
  const response = await axios.get(`${BASE_URL}/photography-types`);
  return response.data;
};

// Get sub photography categories
export const getPhotographyCategories = async () => {
  const response = await axios.get(`${BASE_URL}/photography-categories`);
  return response.data;
};

// Get main+sub photography types with categories
export const getPhotographyTypesWithCategories = async () => {
  const response = await axios.get(
    `${BASE_URL}/photography-types/with-categories`
  );
  return response.data;
};

// Get photos by ID
export const getPhotographyById = async (id) => {
  const response = await axios.get(`${BASE_URL}/photography/photography/${id}`);
  return response.data;
};

// Get all photos
export const getAllPhotography = async () => {
  const response = await axios.get(`${BASE_URL}/photography/photography`);
  return response.data;
};

// Get photos by type
export const getPhotographyByType = async (id) => {
  const response = await axios.get(`${BASE_URL}/photography/filter?type=${id}`);
  return response.data;
};

// Get photos by subcategory
export const getPhotographyByCategory = async (id) => {
  const response = await axios.get(
    `${BASE_URL}/photography/filter?category=${id}`
  );
  return response.data;
};
