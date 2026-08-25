import {
    createMeasurement,
    getMeasurement,
    updateMeasurement,
    deleteMeasurement,
    getMyMeasurement,
    updateMyMeasurement,
} from "../services/measurement.service.js";

const create = async (req, res) => {
    try {
        const { clientId } = req.params;

        const {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        } = req.body;

        const measurementData = {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        };

        // Remove undefined fields
        Object.keys(measurementData).forEach((key) => {
            if (measurementData[key] === undefined) {
                delete measurementData[key];
            }
        });

        const result = await createMeasurement(
            clientId,
            req.user.userId,
            measurementData
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        if (result.error === "MEASUREMENT_EXISTS") {
            return res.status(409).json({
                message: "Measurement already exists for this client",
            });
        }

        return res.status(201).json({
            message: "Measurement created successfully",
            measurement: result.measurement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getSingle = async (req, res) => {
    try {
        const { clientId } = req.params;

        const result = await getMeasurement(
            clientId,
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        if (result.error === "MEASUREMENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Measurement not found",
            });
        }

        return res.status(200).json({
            message: "Measurement fetched successfully",
            measurement: result.measurement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const update = async (req, res) => {
    try {
        const { clientId } = req.params;

        const {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        } = req.body;

        const updateData = {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        };

        // Remove fields that were not provided
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const result = await updateMeasurement(
            clientId,
            req.user.userId,
            updateData
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        if (result.error === "MEASUREMENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Measurement not found",
            });
        }

        return res.status(200).json({
            message: "Measurement updated successfully",
            measurement: result.measurement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    try {
        const { clientId } = req.params;

        const result = await deleteMeasurement(
            clientId,
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client not found",
            });
        }

        if (result.error === "MEASUREMENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Measurement not found",
            });
        }

        return res.status(200).json({
            message: "Measurement deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const getMy = async (req, res) => {
    try {
        const result = await getMyMeasurement(
            req.user.userId
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        if (
            result.error ===
            "MEASUREMENT_NOT_FOUND"
        ) {
            return res.status(404).json({
                message: "Measurement not found",
            });
        }

        return res.status(200).json({
            message:
                "Your measurements fetched successfully",
            measurement: result.measurement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const updateMy = async (req, res) => {
    try {
        const {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        } = req.body;

        const updateData = {
            chest,
            waist,
            hip,
            shoulder,
            sleeveLength,
            shirtLength,
            neck,
            trouserWaist,
            trouserLength,
            thigh,
            knee,
            ankle,
            notes,
        };

        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });

        const result = await updateMyMeasurement(
            req.user.userId,
            updateData
        );

        if (result.error === "CLIENT_NOT_FOUND") {
            return res.status(404).json({
                message: "Client profile not found",
            });
        }

        if (
            result.error ===
            "MEASUREMENT_NOT_FOUND"
        ) {
            return res.status(404).json({
                message: "Measurement not found",
            });
        }

        return res.status(200).json({
            message:
                "Your measurements updated successfully",
            measurement: result.measurement,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

export {
    create,
    getSingle,
    update,
    remove,
    getMy,
    updateMy,
};