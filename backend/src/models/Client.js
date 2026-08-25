import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        // Optional link to CLIENT login account
        // A tailor can create a client profile
        // even if the client does not have a login account yet.
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            sparse: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
        },

        address: {
            type: String,
            trim: true,
        },

        gender: {
            type: String,
            enum: ["MALE", "FEMALE", "OTHER"],
        },

        notes: {
            type: String,
            trim: true,
        },

        // Which tailor owns this client
        tailor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Client = mongoose.model(
    "Client",
    clientSchema
);

export default Client;
