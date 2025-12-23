import api from "./api";

const submitTest = (wpm, accuracy, durationSeconds, errorCount, errorKeys) => {
    return api.post("/test/submit", {
        wpm,
        accuracy,
        durationSeconds,
        errorCount,
        errorKeys,
    });
};

const getHistory = () => {
    return api.get("/test/history");
};

const getPersonalizedText = (length = "medium") => {
    // If no user, the backend will treat it as a guest request due to our controller update
    return api.get(`/test/generate?length=${length}`);
};

const getLeaderboard = () => {
    return api.get("/test/leaderboard");
};

const getUserProfile = () => {
    return api.get("/test/profile");
};

const TestService = {
    submitTest,
    getHistory,
    getPersonalizedText,
    getLeaderboard,
    getUserProfile
};

export default TestService;
