import mongoose from "mongoose";

const measurementSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
            unique: true,
        },

        chest: {
            type: Number,
            min: 0,
        },

        waist: {
            type: Number,
            min: 0,
        },

        hip: {
            type: Number,
            min: 0,
        },

        shoulder: {
            type: Number,
            min: 0,
        },

        sleeveLength: {
            type: Number,
            min: 0,
        },

        shirtLength: {
            type: Number,
            min: 0,
        },

        neck: {
            type: Number,
            min: 0,
        },

        trouserWaist: {
            type: Number,
            min: 0,
        },

        trouserLength: {
            type: Number,
            min: 0,
        },

        thigh: {
            type: Number,
            min: 0,
        },

        knee: {
            type: Number,
            min: 0,
        },

        ankle: {
            type: Number,
            min: 0,
        },

        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Measurement = mongoose.model(
    "Measurement",
    measurementSchema
);

export default Measurement;