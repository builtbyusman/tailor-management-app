import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    // ==========================================
    // CLIENT USER ACCOUNT
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      unique: true,
      sparse: true,
    },

    // ==========================================
    // TAILOR
    // ==========================================

    tailor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==========================================
    // CLIENT INFORMATION
    // ==========================================

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
      enum: ["MALE", "FEMALE"],
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

const Client = mongoose.model("Client", clientSchema);

export default Client;