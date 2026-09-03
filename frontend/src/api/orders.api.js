import api from "./axios";

// ==========================================
// GET ALL TAILOR ORDERS
// ==========================================

const getOrders = async () => {
  try {
    const response = await api.get("/orders");

    return response.data;
  } catch (error) {
    console.error(
      "Get orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET ORDERS OF SELECTED CLIENT
// ==========================================

const getClientOrders = async (clientId) => {
  try {
    const response = await api.get(
      `/orders/client/${clientId}`
    );

    console.log(
      "Get client orders API response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get client orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET SINGLE ORDER
// ==========================================

const getOrder = async (orderId) => {
  try {
    const response = await api.get(
      `/orders/${orderId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get order API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// CREATE ORDER
// ==========================================

const createOrder = async (clientId, orderData) => {
  try {
    const response = await api.post(
      `/orders/${clientId}`,
      orderData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Create order API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// UPDATE ORDER
// ==========================================

const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(
      `/orders/${orderId}`,
      orderData
    );

    console.log(
      "Update order API response:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update order API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// DELETE ORDER
// ==========================================

const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(
      `/orders/${orderId}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Delete order API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.patch(
      `/orders/${orderId}/status`,
      {
        status,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Update order status API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET ORDER SUMMARY
// ==========================================

const getOrderSummary = async () => {
  try {
    const response = await api.get(
      "/orders/summary"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get order summary API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET RECENT ORDERS
// ==========================================

const getRecentOrders = async () => {
  try {
    const response = await api.get(
      "/orders/recent"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get recent orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET PENDING ORDERS
// ==========================================

const getPendingOrders = async () => {
  try {
    const response = await api.get(
      "/orders/pending"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get pending orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// GET READY ORDERS
// ==========================================

const getReadyOrders = async () => {
  try {
    const response = await api.get(
      "/orders/ready"
    );

    return response.data;
  } catch (error) {
    console.error(
      "Get ready orders API error:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// ==========================================
// EXPORTS
// ==========================================

export {
  getOrders,
  getClientOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrderSummary,
  getRecentOrders,
  getPendingOrders,
  getReadyOrders,
};