const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Patient = require('./patients'); // Import the Patient model
const Joi = require('joi');
const session = require('express-session');
const bodyParser = require('body-parser')

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure:false,
      maxAge: 24 * 60 * 60 * 1000 
  }
}));

const cors = require('cors');

router.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    method:["POST" , "GET"],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

// Define the schema for medical reports
const medicalReportSchema = new mongoose.Schema({
    // userEmail: {
    //     type: String,
    //     required: true
    // }
    patientId:{
        type:String,
        required:true
    },
    patientName: {
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

        const {patientId,patientName} = req.session; // Extract email and username from form data

        console.log(req.session)
        console.log(req.session.patientName);
        console.log(req.session.patientId)
        // Check if email and username are provided
        if (!patientId || !patientName) {
            return res.status(400).send('Login patient to upload document');
        }

        // Find patient by email
        // const patient = await Patient.findOne({ email });
        // if (!patient) {
        //     return res.status(404).send('Patient not found');
        // }

        // Store PDF data in the medical report document
        const medicalReport = new MedicalReport({
            patientId,
            patientName,
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
