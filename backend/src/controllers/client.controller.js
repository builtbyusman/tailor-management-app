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
        // CREATE CLIENT
        // ======================================

        const result = await createClient({
            name,
            phone,
            email,
            address,
            gender,
            notes,

            // Logged-in tailor
            tailorId: req.user.userId,
        });


        // ======================================
        // CLIENT USER ROLE ERROR
        // ======================================

        if (
            result.error ===
            "INVALID_USER_ROLE"
        ) {
            return res.status(400).json({
                message:
                    "The email belongs to a non-client account. Please use a CLIENT account email.",
            });
        }


        // ======================================
        // CLIENT PROFILE ALREADY EXISTS
        // ======================================

        if (
            result.error ===
            "CLIENT_PROFILE_EXISTS"
        ) {
            return res.status(409).json({
                message:
                    "A client profile already exists for this account.",
            });
        }


        // ======================================
        // SUCCESS
        // ======================================

        return res.status(201).json({
            message:
                result.user
                    ? "Client created and account linked successfully"
                    : "Client created successfully. No client account was linked.",

            client: result.client,

            accountLinked: Boolean(
                result.user
            ),
        });

    } catch (error) {

        console.error(
            "Create client error:",
            error
        );

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

        const clients = await getClients(
            req.user.userId
        );

        return res.status(200).json({
            message:
                "Clients fetched successfully",

            count: clients.length,

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

        const { id } = req.params;

        const client = await getClientById(
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

        const { id } = req.params;

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
        // REMOVE UNDEFINED FIELDS
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
        // UPDATE
        // ======================================

        const client = await updateClient(
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

        const { id } = req.params;

        const client = await deleteClient(
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
                "Client deleted successfully",
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