import api from "./axios";

// ==========================================
// CREATE PAYMENT
// ==========================================

const createPayment = async (
  orderId,
  paymentData
) => {
  try {
    const response = await api.post(
      `/payments/${orderId}`,
      paymentData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create payment API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// GET PAYMENT HISTORY
// ==========================================

const getPayments = async (
  orderId
) => {
  try {
    const response = await api.get(
      `/payments/${orderId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get payments API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// GET PAYMENT SUMMARY
// ==========================================

const getPaymentSummary = async (
  orderId
) => {
  try {
    const response = await api.get(
      `/payments/${orderId}/summary`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get payment summary API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};


// ==========================================
// EXPORTS
// ==========================================

export {
  createPayment,
  getPayments,
  getPaymentSummary,
};
