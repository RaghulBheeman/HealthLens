const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const session = require('express-session');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const Doctors = require('./users')

router.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure:false,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours (in milliseconds)
  }
}));


const cors = require('cors');

router.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    method:["POST" , "GET"],
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
}))

router.use(express.json());
router.use(cookieParser());
router.use(bodyParser.json());

const adminSchema = mongoose.Schema({
    userName:{type:String , required:true, minlength:3},
    email:{type:String , required:true},
    password:{type:String , required:true},
    repeatPassword:{type:String , required:true}
})

const Admin = mongoose.model('Admin', adminSchema);


// get admin 
router.get('/admin', async (req, res) => {
    console.log("the name is",req.session.adminName)
    if(req.session.adminName){
        
        return res.json({valid:true , adminName: req.session.adminName})
    }else{
        return res.json({valid:false})
    }
});
//admins registration
router.post('/admin/register',async (req,res)=>{
    const {error} = validateUserRegisterData(req.body);

    if(error) res.status(400).send(error.details[0].message)
    else{
        const admin  = new Admin({
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password,
            repeatPassword:req.body.repeatPassword
        })
        await admin.save();
        res.send(admin);
    }
    
})

// admin login
router.post('/admin/login', async (req, res) => {
    const{error} = validateLoginData(req.body)
    if(error) res.status(400).send(error.details[0].message)
    else{
        const { email, password } = req.body;
        try {
            const admin = await Admin.findOne({ email, password });
            if (!admin) {
                return res.status(401).send("Invalid email or password");
            }
            // Store user ID in session
            req.session.adminId = admin.id;
            req.session.adminName = admin.userName;

            console.log(req.session)

            return res.json({Login:true , adminId:req.session.adminId}).status(200)
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
   
});







//get doctors
router.get('/admin/doctors', async (req,res)=>{

    console.log("Hiiiiii")
    console.log(req.session)
    if (req.session && req.session.adminId) {
        
        const doctors = await Doctors.find();
        doctors.forEach(doctor => {
            console.log(doctor.userName)
        });
        res.send(doctors).status(200);
    }else {
        res.status(401).send("You are not authorized ");
    }
   
})

// Update user
router.put('/admin/update/:id', async (req, res) => {
    const { error } = validateUpdateData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const admin = await Admin.findByIdAndUpdate(
            req.params.id,
            { userName: req.body.userName, email: req.body.email }, // Use req.body instead of req.params
            { new: true }
        );
        if (!admin) return res.status(404).send('The user with the given ID was not found.');
        
        res.send(admin);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

//delete user
router.delete('/admin/delete/:id', async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).send('The user with the given ID was not found');
        
        res.send(admin);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Admin logout
router.post('/admin/logout', (req, res) => {
    // Check if there is a user session and if the IDs match
    if (req.session && req.session.adminId) {

        console.log("before:", req.session);
        delete req.session.adminId;
        delete req.session.adminName;
        console.log("after:",req.session);
        res.status(200).send("Logout successful");
    } else {
        res.status(401).send("You are not authorized to log out");
    }
});


//validation for user registeration
const validateUserRegisterData = (user) =>{

    const schema = {
        userName:Joi.string().min(3).required(),
        email:Joi.string().email({ minDomainSegments: 2 })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
        password:Joi.string().min(6).required(),
        //error: repeatPassword: Joi.ref('password'),
        repeatPassword: Joi.string().required().valid(Joi.ref('password'))
        //error: repeatPassword: Joi.string().required().ref('password')
    }

    return Joi.validate(user,schema);
}

//validation for user login
const validateLoginData = (user) =>{
    const schema = {
        email:Joi.string().email({ minDomainSegments: 2 })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
        password:Joi.string().required(),
    }

    return Joi.validate(user,schema);
}

//validation for update user
const validateUpdateData = (user) =>{
    const schema = {
        userName:Joi.string().min(3).required(),
        email:Joi.string().email({ minDomainSegments: 2 })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),

    }

    return Joi.validate(user,schema);
}

module.exports = router