import api from "./axios";

// ==========================================
// GET CLIENT MEASUREMENT
// ==========================================

const getMeasurement = async (clientId) => {
  try {
    const response = await api.get(
      `/measurements/${clientId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get measurement API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// CREATE CLIENT MEASUREMENT
// ==========================================

const createMeasurement = async (
  clientId,
  measurementData
) => {
  try {
    const response = await api.post(
      `/measurements/${clientId}`,
      measurementData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create measurement API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// UPDATE CLIENT MEASUREMENT
// ==========================================

const updateMeasurement = async (
  clientId,
  measurementData
) => {
  try {
    const response = await api.put(
      `/measurements/${clientId}`,
      measurementData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update measurement API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// DELETE CLIENT MEASUREMENT
// ==========================================

const deleteMeasurement = async (
  clientId
) => {
  try {
    const response = await api.delete(
      `/measurements/${clientId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete measurement API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// EXPORTS
// ==========================================

export {
  getMeasurement,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
};
