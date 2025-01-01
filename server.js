const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({ origin: "http://localhost:8080" }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle POST requests for form submission
app.post("/submit-endpoint", (req, res) => {
    console.log("Form data received:", req.body);
    res.status(200).send("Form submitted successfully!");
});

// Add a route for the root path
app.get("/", (req, res) => {
    res.send("Welcome to the Node.js Server!"); // Simple response for testing
});

app.listen(3000, () => console.log("Server running on port 3000"));
