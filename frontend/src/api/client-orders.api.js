import api from "./axios";

const getMyOrders = async () => {
    try {
        const response = await api.get("/orders/my");

        console.log(
            "CLIENT ORDERS API RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "CLIENT ORDERS API ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        throw error;
    }
};

const getMyOrder = async (orderId) => {
    try {
        if (!orderId) {
            throw new Error("Order ID is required");
        }

        const response = await api.get(
            `/orders/my/${orderId}`
        );

        console.log(
            "CLIENT SINGLE ORDER API RESPONSE:",
            response.data
        );

        return response.data;
    } catch (error) {
        console.error(
            "CLIENT SINGLE ORDER API ERROR:",
            error.response?.status,
            error.response?.data || error.message
        );

        throw error;
    }
};

export {
    getMyOrders,
    getMyOrder,
};