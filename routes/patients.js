const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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

        req.session.cookie.patientId = patient._id; // Store patient ID in session
        req.session.cookie.patientName = patient.userName;

        // console.log("id",req.session.patientId)
        // console.log(req.session.patientName)
        console.log(req.session)
            
        return res.json({Login:true , patientId:req.session.patientId}).status(200)
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post('/patient/logout', (req, res) => {
    if (req.session && req.session.userId) {
        // req.session.destroy((err) => {
        //     if (err) {
        //         console.error("Error destroying session:", err);
        //         res.status(500).send("Internal Server Error");
        //     } else {
        //         res.clearCookie('connect.sid');
        //         res.status(200).send("Logout successful");
        //     }
        // });
        console.log(req.session)
        delete req.session.cookie.patientId;
        console.log(req.session)
        res.status(200).send("Logout successful");
    } else {
        // If there is no user session or the IDs don't match, send an error response
        res.status(401).send("You are not authorized to log out");
    }
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
