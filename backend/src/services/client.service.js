import Client from "../models/Client.js";
import User from "../models/User.js";

// ==========================================
// CREATE CLIENT PROFILE - TAILOR
// ==========================================

const createClient = async ({
    name,
    phone,
    email,
    address,
    gender,
    notes,
    tailorId,
}) => {

    let clientUser = null;

    // ==========================================
    // FIND CLIENT USER ACCOUNT
    // ==========================================

    if (email) {
        clientUser = await User.findOne({
            email: email.toLowerCase().trim(),
        });

        // If email exists but belongs to non-client
        if (
            clientUser &&
            clientUser.role !== "CLIENT"
        ) {
            return {
                error: "INVALID_USER_ROLE",
            };
        }

        // ========================================
        // CHECK EXISTING CLIENT PROFILE
        // ========================================

        if (clientUser) {
            const existingClient = await Client.findOne({
                user: clientUser._id,
            });

            if (existingClient) {
                return {
                    error: "CLIENT_PROFILE_EXISTS",
                };
            }
        }
    }

    // ==========================================
    // CREATE CLIENT PROFILE
    // ==========================================

    const client = await Client.create({
        user: clientUser
            ? clientUser._id
            : undefined,

        name,
        phone,
        email,
        address,
        gender,
        notes,

        tailor: tailorId,
    });

    // ==========================================
    // RETURN
    // ==========================================

    return {
        client,
        user: clientUser,
    };
};


// ==========================================
// GET ALL CLIENTS - TAILOR
// ==========================================

const getClients = async (tailorId) => {

    const clients = await Client.find({
        tailor: tailorId,
    })
        .populate(
            "user",
            "name email role"
        )
        .sort({
            createdAt: -1,
        });

    return clients;
};


// ==========================================
// GET SINGLE CLIENT - TAILOR
// ==========================================

const getClientById = async (
    clientId,
    tailorId
) => {

    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    }).populate(
        "user",
        "name email role"
    );

    return client;
};


// ==========================================
// UPDATE CLIENT - TAILOR
// ==========================================

const updateClient = async (
    clientId,
    tailorId,
    updateData
) => {

    const client = await Client.findOneAndUpdate(
        {
            _id: clientId,
            tailor: tailorId,
        },
        updateData,
        {
            new: true,
            runValidators: true,
        }
    ).populate(
        "user",
        "name email role"
    );

    return client;
};


// ==========================================
// DELETE CLIENT - TAILOR
// ==========================================

const deleteClient = async (
    clientId,
    tailorId
) => {

    const client = await Client.findOneAndDelete({
        _id: clientId,
        tailor: tailorId,
    });

    return client;
};


// ==========================================
// EXPORTS
// ==========================================

export {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};