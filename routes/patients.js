const express = require('express');
const router = express.Router();
const Joi = require('joi');
const multer = require('multer');
const mongoose = require('mongoose');

const cors = require('cors');

router.use(cors());

const patientSchema = mongoose.Schema({
    userName: { type: String, required: true, minlength: 3 },
    email: { type: String, required: true }
});

const Patient = mongoose.model('Patient', patientSchema);

router.get('/patient', async (req, res) => {
    const patients = await Patient.find();
    res.send(patients);
});

router.post('/patient/register', async (req, res) => {
    const { error } = validatePatientRegisterData(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    try {
        const patient = new Patient({
            userName: req.body.userName,
            email: req.body.email,
        });
        await patient.save();
        res.send(patient);
    } catch (error) {
        console.error("Error registering patient:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/patient/login', async (req, res) => {
    const { error } = validateLoginData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const { userName, email } = req.body;
        const patient = await Patient.findOne({ userName, email });
        if (!patient) return res.status(401).send("Invalid email or password");

        req.session.patientId = patient._id; // Store patient ID in session
        res.status(200).send("Login successful");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/patient/logout', (req, res) => {
    const { patientId } = req.body;
    const loggedInPatientId = req.session.patientId;
    if (!loggedInPatientId || loggedInPatientId !== patientId) {
        return res.status(401).send("You are not authorized to log out");
    }

    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).send("Failed to logout");
        } else {
            res.status(200).send("Logout successful");
        }
    });
});


router.put('/patient/update/:id', async (req, res) => {
    const { error } = validateUpdateData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { userName: req.body.userName, email: req.body.email },
            { new: true }
        );
        if (!patient) return res.status(404).send('The user with the given ID was not found.');
        
        res.send(patient);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/patient/delete/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        if (!patient) return res.status(404).send('The user with the given ID was not found');
        
        res.send(patient);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});

const validatePatientRegisterData = (user) => {
    const schema = {
        userName: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
    };

    return Joi.validate(user, schema);
}

const validateUpdateData = (user) => {
    const schema = {
        userName: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
    };

    return Joi.validate(user, schema);
}

const validateLoginData = (user) => {
    const schema = {
        userName: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required()
    };

    return Joi.validate(user, schema);
}

module.exports = router;
