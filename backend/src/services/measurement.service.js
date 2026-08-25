import Measurement from "../models/Measurement.js";
import Client from "../models/Client.js";

const createMeasurement = async (
    clientId,
    tailorId,
    measurementData
) => {
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const existingMeasurement = await Measurement.findOne({
        client: clientId,
    });

    if (existingMeasurement) {
        return {
            error: "MEASUREMENT_EXISTS",
        };
    }

    const measurement = await Measurement.create({
        client: clientId,
        ...measurementData,
    });

    return {
        measurement,
    };
};

const getMeasurement = async (clientId, tailorId) => {
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const measurement = await Measurement.findOne({
        client: clientId,
    });

    if (!measurement) {
        return {
            error: "MEASUREMENT_NOT_FOUND",
        };
    }

    return {
        measurement,
    };
};

const updateMeasurement = async (
    clientId,
    tailorId,
    updateData
) => {
    // Check client ownership
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const measurement = await Measurement.findOneAndUpdate(
        {
            client: clientId,
        },
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!measurement) {
        return {
            error: "MEASUREMENT_NOT_FOUND",
        };
    }

    return {
        measurement,
    };
};

const deleteMeasurement = async (clientId, tailorId) => {
    // Check client ownership
    const client = await Client.findOne({
        _id: clientId,
        tailor: tailorId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const measurement = await Measurement.findOneAndDelete({
        client: clientId,
    });

    if (!measurement) {
        return {
            error: "MEASUREMENT_NOT_FOUND",
        };
    }

    return {
        measurement,
    };
};

const getMyMeasurement = async (userId) => {
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const measurement = await Measurement.findOne({
        client: client._id,
    });

    if (!measurement) {
        return {
            error: "MEASUREMENT_NOT_FOUND",
        };
    }

    return {
        measurement,
    };
};

const updateMyMeasurement = async (
    userId,
    updateData
) => {
    const client = await Client.findOne({
        user: userId,
    });

    if (!client) {
        return {
            error: "CLIENT_NOT_FOUND",
        };
    }

    const measurement =
        await Measurement.findOneAndUpdate(
            {
                client: client._id,
            },
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

    if (!measurement) {
        return {
            error: "MEASUREMENT_NOT_FOUND",
        };
    }

    return {
        measurement,
    };
};

export {
    createMeasurement,
    getMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMyMeasurement,
    updateMyMeasurement,
};