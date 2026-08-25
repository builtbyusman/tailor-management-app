import getDashboardData from "../services/dashboard.service.js";

const getDashboard = async (req, res) => {
    try {
        const dashboard = await getDashboardData(
            req.user.userId
        );

        return res.status(200).json({
            message: "Dashboard data fetched successfully",
            dashboard,
        });
    } catch (error) {
        console.error("Dashboard error:", error);

        return res.status(500).json({
            message: error.message,
        });
    }
};

export {
    getDashboard,
};