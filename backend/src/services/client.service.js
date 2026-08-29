
import Client from "../models/Client.js";

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

    // ======================================
    // Create client profile
    // ======================================

    const client = await Client.create({
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
