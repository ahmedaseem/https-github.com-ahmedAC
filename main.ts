const cors = require("cors");

app.use(cors({
    origin: "https://gov-server.github.io",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false
}));
