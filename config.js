const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocalhost
    ? "http://localhost:5050/api"
    : "https://api.asem.digital/api";

const CONFIG = {
    api: {
        base: API_BASE_URL,
        location: `${API_BASE_URL}/location`,
    },
    timeout: 15000,
};

export { CONFIG };
export default CONFIG;
