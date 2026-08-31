import {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
} from "../services/client.service.js";


// ==========================================
// CREATE CLIENT
// ==========================================

const create = async (req, res) => {

    try {

        const {
            name,
            phone,
            email,
            password,
            address,
            gender,
            notes,
        } = req.body;


        // ======================================
        // REQUIRED FIELDS
        // ======================================

        if (!name || !phone) {

            return res.status(400).json({
                message:
                    "Client name and phone are required",
            });
        }


        // ======================================
        // EMAIL REQUIRED
        // ======================================

        if (!email) {

            return res.status(400).json({
                message:
                    "Client email is required",
            });
        }


        // ======================================
        // PASSWORD REQUIRED
        // ======================================

        if (!password) {

            return res.status(400).json({
                message:
                    "Client password is required",
            });
        }


        // ======================================
        // PASSWORD LENGTH
        // ======================================

        if (password.length < 6) {

            return res.status(400).json({
                message:
                    "Client password must be at least 6 characters",
            });
        }


        // ======================================
        // CREATE CLIENT
        // ======================================

        const result = await createClient({

            name,
            phone,
            email,
            password,

            address,
            gender,
            notes,

            // Logged-in tailor
            tailorId: req.user.userId,
        });


        // ======================================
        // SUCCESS
        // ======================================

        return res.status(201).json({

            message:
                "Client account created successfully",

            client: result.client,

            user: result.user,

        });

    } catch (error) {

        console.error(
            "Create client error:",
            error
        );


        // ======================================
        // DUPLICATE EMAIL
        // ======================================

        if (
            error.code ===
            "EMAIL_ALREADY_EXISTS"
        ) {

            return res.status(409).json({
                message:
                    "This email is already registered",
            });
        }


        // ======================================
        // EMAIL REQUIRED
        // ======================================

        if (
            error.code ===
            "CLIENT_EMAIL_REQUIRED"
        ) {

            return res.status(400).json({
                message:
                    "Client email is required",
            });
        }


        // ======================================
        // PASSWORD REQUIRED
        // ======================================

        if (
            error.code ===
            "CLIENT_PASSWORD_REQUIRED"
        ) {

            return res.status(400).json({
                message:
                    "Client password is required",
            });
        }


        // ======================================
        // MONGOOSE DUPLICATE
        // ======================================

        if (error.code === 11000) {

            return res.status(409).json({
                message:
                    "Client account already exists",
            });
        }


        // ======================================
        // SERVER ERROR
        // ======================================

        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// GET ALL CLIENTS
// ==========================================

const getAll = async (req, res) => {

    try {

        const clients =
            await getClients(
                req.user.userId
            );


        return res.status(200).json({

            message:
                "Clients fetched successfully",

            count:
                clients.length,

            clients,
        });

    } catch (error) {

        console.error(
            "Get clients error:",
            error
        );


        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// GET SINGLE CLIENT
// ==========================================

const getSingle = async (req, res) => {

    try {

        const { id } =
            req.params;


        const client =
            await getClientById(
                id,
                req.user.userId
            );


        if (!client) {

            return res.status(404).json({
                message:
                    "Client not found",
            });
        }


        return res.status(200).json({

            message:
                "Client fetched successfully",

            client,
        });

    } catch (error) {

        console.error(
            "Get client error:",
            error
        );


        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// UPDATE CLIENT
// ==========================================

const update = async (req, res) => {

    try {

        const { id } =
            req.params;


        const {
            name,
            phone,
            email,
            address,
            gender,
            notes,
        } = req.body;


        const updateData = {
            name,
            phone,
            email,
            address,
            gender,
            notes,
        };


        // ======================================
        // REMOVE UNDEFINED
        // ======================================

        Object.keys(updateData).forEach(
            (key) => {

                if (
                    updateData[key] ===
                    undefined
                ) {

                    delete updateData[key];
                }
            }
        );


        // ======================================
        // UPDATE CLIENT
        // ======================================

        const client =
            await updateClient(
                id,
                req.user.userId,
                updateData
            );


        if (!client) {

            return res.status(404).json({
                message:
                    "Client not found",
            });
        }


        return res.status(200).json({

            message:
                "Client updated successfully",

            client,
        });

    } catch (error) {

        console.error(
            "Update client error:",
            error
        );


        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// DELETE CLIENT
// ==========================================

const remove = async (req, res) => {

    try {

        const { id } =
            req.params;


        const client =
            await deleteClient(
                id,
                req.user.userId
            );


        if (!client) {

            return res.status(404).json({
                message:
                    "Client not found",
            });
        }


        return res.status(200).json({

            message:
                "Client and account deleted successfully",
        });

    } catch (error) {

        console.error(
            "Delete client error:",
            error
        );


        return res.status(500).json({
            message:
                "Internal server error",
        });
    }
};


// ==========================================
// EXPORTS
// ==========================================

export {
    create,
    getAll,
    getSingle,
    update,
    remove,
};