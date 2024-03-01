const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');
const cors = require('cors');

router.use(cors())

// const admins =[
//     {id:1 ,userName:"AAA" ,email:"aaa@gmail.com", password:"AAAAAA", repeatPassword:"AAAAAA" }
// ]

const adminSchema = mongoose.Schema({
    userName:{type:String , required:true, minlength:3},
    email:{type:String , required:true},
    password:{type:String , required:true},
    repeatPassword:{type:String , required:true}
})

const Admin = mongoose.model('Admin', adminSchema);

//get admins
router.get('/admin', async (req,res)=>{
    const admins = await Admin.find();
    res.send(admins);
})

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

//  login route
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
            req.session.adminId = admin._id;
            res.status(200).send("Login successful");
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
   
});

// Admin logout
router.post('/admin/logout/:id', (req, res) => {
    if (req.session && req.session.adminId && req.session.adminId === req.params.id) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.status(200).send("Logout successful");
            }
        });
    } else {
        res.status(401).send("You are not authorized to log out");
    }
});




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