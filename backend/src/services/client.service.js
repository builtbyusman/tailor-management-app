import Client from "../models/Client.js";
import User from "../models/User.js";

// ==========================================
// CREATE CLIENT PROFILE - TAILOR
// ==========================================

const createClient = async ({
    userId,
    name,
    phone,
    email,
    address,
    gender,
    notes,
    tailorId,
}) => {
    // Check that the selected user exists
    const user = await User.findById(userId);

    if (!user) {
        return {
            error: "USER_NOT_FOUND",
        };
    }

    // Only CLIENT users can have a client profile
    if (user.role !== "CLIENT") {
        return {
            error: "INVALID_USER_ROLE",
        };
    }

    // A client user can only have one client profile
    const existingClient = await Client.findOne({
        user: userId,
    });

    if (existingClient) {
        return {
            error: "CLIENT_PROFILE_EXISTS",
        };
    }

    // Create client profile
    const client = await Client.create({
        user: userId,
        name,
        phone,
        email,
        address,
        gender,
        notes,
        tailor: tailorId,
    });

    return {
        client,
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

export {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
};