import bcrypt from "bcryptjs";

import Client from "../models/Client.js";
import User from "../models/User.js";


// ==========================================
// CREATE CLIENT + CLIENT USER ACCOUNT
// ==========================================

const createClient = async ({
    name,
    phone,
    email,
    password,
    address,
    gender,
    notes,
    tailorId,
}) => {

    // ======================================
    // EMAIL REQUIRED FOR LOGIN
    // ======================================

    if (!email) {
        const error = new Error(
            "Client email is required for account creation"
        );

        error.code = "CLIENT_EMAIL_REQUIRED";

        throw error;
    }


    // ======================================
    // PASSWORD REQUIRED
    // ======================================

    if (!password) {
        const error = new Error(
            "Client password is required"
        );

        error.code = "CLIENT_PASSWORD_REQUIRED";

        throw error;
    }


    // ======================================
    // CHECK EMAIL
    // ======================================

    const existingUser = await User.findOne({
        email: email.toLowerCase().trim(),
    });

    if (existingUser) {

        const error = new Error(
            "Email is already registered"
        );

        error.code = "EMAIL_ALREADY_EXISTS";

        throw error;
    }


    // ======================================
    // HASH PASSWORD
    // ======================================

    const hashedPassword =
        await bcrypt.hash(password, 10);


    // ======================================
    // CREATE CLIENT USER ACCOUNT
    // ======================================

    const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: "CLIENT",
    });


    // ======================================
    // CREATE CLIENT PROFILE
    // ======================================

    try {

        const client = await Client.create({
            user: user._id,

            tailor: tailorId,

            name,
            phone,
            email,
            address,
            gender,
            notes,
        });


        return {
            client,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };

    } catch (error) {

        // ==================================
        // ROLLBACK USER
        // ==================================

        await User.findByIdAndDelete(
            user._id
        );

        throw error;
    }
};


// ==========================================
// GET ALL CLIENTS
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
// GET SINGLE CLIENT
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
// UPDATE CLIENT
// ==========================================

const updateClient = async (
    clientId,
    tailorId,
    updateData
) => {

    const client =
        await Client.findOneAndUpdate(
            {
                _id: clientId,
                tailor: tailorId,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        )
        .populate(
            "user",
            "name email role"
        );

    return client;
};


// ==========================================
// DELETE CLIENT
// ==========================================

const deleteClient = async (
    clientId,
    tailorId
) => {

    const client =
        await Client.findOneAndDelete({
            _id: clientId,
            tailor: tailorId,
        });

    // ======================================
    // DELETE LINKED USER ACCOUNT
    // ======================================

    if (client?.user) {

        await User.findByIdAndDelete(
            client.user
        );
    }

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