require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/submit-form", (req, res) => {
    const { firstName, lastName, email, tel, fleetSize, trailerType } =
        req.body;

    if (!firstName || !lastName || !email || !fleetSize || !trailerType) {
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
