const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: "https://iron-wing-dispatching.com", // Replace with your actual frontend domain
    methods: "GET,POST,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.post("/submit-form", (req, res) => {
    const { firstName, lastName, email, tel, fleetSize, trailerType } =
        req.body;

    if (!firstName || !lastName || !email || !fleetSize || !trailerType) {
        return res
            .status(400)
            .json({ error: "All required fields must be filled." });
    }

    console.log("Form received:", req.body);

    // Here, you could save the data to a database (e.g., MongoDB, PostgreSQL)

    // Optionally, send an email confirmation
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_USER, // Set in .env file
            pass: process.env.EMAIL_PASS, // Set in .env file
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Form Submission Received",
        text: `Hi ${firstName},\n\nThank you for signing up! We will contact you soon.\n\nIron Wing Dispatching`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email Error:", error);
        } else {
            console.log("Email Sent:", info.response);
        }
    });

    res.status(200).json({ message: "Form submitted successfully!" });
});

app.listen(PORT, () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
});
