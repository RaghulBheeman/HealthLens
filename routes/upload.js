const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Patient = require('./patients'); // Import the Patient model
const Joi = require('joi');

const cors = require('cors');
router.use(cors());

// Define the schema for medical reports
const medicalReportSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    pdfData: {
        data: Buffer, // Store binary data of the PDF
        contentType: String // Store the content type of the PDF
    }
});

// Create a model for medical reports
const MedicalReport = mongoose.model('MedicalReport', medicalReportSchema);

// Configure multer storage
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({ storage: storage });

// Handle file upload and store PDF data in MongoDB document
router.post('/patient/upload', upload.single('pdfFile'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Please upload the file');
        }

        const { email, username } = req.body; // Extract email and username from form data

        // Check if email and username are provided
        if (!email || !username) {
            return res.status(400).send('Email and username are required');
        }

        // Find patient by email
        // const patient = await Patient.findOne({ email });
        // if (!patient) {
        //     return res.status(404).send('Patient not found');
        // }

        // Store PDF data in the medical report document
        const medicalReport = new MedicalReport({
            userEmail: email,
            username,
            pdfData: {
                data: req.file.buffer, // Store the buffer containing PDF data
                contentType: req.file.mimetype // Store the content type of the PDF
            }
        });
        await medicalReport.save();

        res.status(200).send('File uploaded successfully.');
    } catch (error) {
        console.error("Error uploading medical report:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
