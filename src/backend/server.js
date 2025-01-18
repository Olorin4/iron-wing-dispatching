require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
};

https.createServer(options, app).listen(3000, () => {
    console.log("Secure server running at https://localhost:3000");
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "frontend"))); // Serve frontend files

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.post("/submit-form", (req, res) => {
    const { firstName, lastName, email, tel, fleetSize, trailerType } =
        req.body;

    if (
        !firstName ||
        !lastName ||
        !email ||
        !tel ||
        !fleetSize ||
        !trailerType
    ) {
        return res.status(400).send("All required fields must be filled.");
    }

    console.log("Form submitted:", req.body);

    // Respond to the client
    res.status(200).send("Form submitted successfully!");
});

app.post("/contact", (req, res) => {
    const { email, tel, enquiry } = req.body;
    console.log(`Contact form submitted: ${email},${tel},${enquiry}`);
    res.status(200).send("Enquiry received.");
});

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);
