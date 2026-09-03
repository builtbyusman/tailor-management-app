import api from "./axios";


// ==========================================
// GET ALL CLIENTS
// ==========================================

export const getClients = async () => {

    try {

        const response =
            await api.get("/clients");

        return response.data;

    } catch (error) {

        console.error(
            "Get clients API error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// GET SINGLE CLIENT
// ==========================================

export const getClient = async (
    clientId
) => {

    try {

        const response =
            await api.get(
                `/clients/${clientId}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "Get client API error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// CREATE CLIENT ACCOUNT
// ==========================================

export const createClient = async (
    data
) => {

    try {

        const response =
            await api.post(
                "/clients",
                data
            );

        return response.data;

    } catch (error) {

        console.error(
            "Create client API error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// UPDATE CLIENT
// ==========================================

export const updateClient = async (
    clientId,
    data
) => {

    try {

        const response =
            await api.put(
                `/clients/${clientId}`,
                data
            );

        return response.data;

    } catch (error) {

        console.error(
            "Update client API error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};


// ==========================================
// DELETE CLIENT
// ==========================================

export const deleteClient = async (
    clientId
) => {

    try {

        const response =
            await api.delete(
                `/clients/${clientId}`
            );

        return response.data;

    } catch (error) {

        console.error(
            "Delete client API error:",
            error.response?.data ||
            error.message
        );

        throw error;
    }
};