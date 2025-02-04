const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "https://iron-wing-dispatching.com",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // Use TLS if port 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
});

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/submit-form", async (req, res) => {
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
        return res
            .status(400)
            .json({ error: "All required fields must be filled." });
    }

    console.log("Form received:", req.body);

    // Here, you could save the data to a database (e.g., MongoDB, PostgreSQL)

    // Send Confirmation Email
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Thank You for Signing Up!",
        text: `Hello ${firstName},\n\nThank you for signing up with Iron Wing Dispatching. We will contact you shortly.\n\nBest,\nIron Wing Dispatching Team`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Email Sent Successfully!");
        res.status(200).json({ message: "Form submitted successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ error: "Failed to send email." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
