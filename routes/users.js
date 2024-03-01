const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Joi = require('joi');

const cors = require('cors');

router.use(cors())

const userSchema = mongoose.Schema({
    userName:{type:String , required:true, minlength:3},
    email:{type:String , required:true},
    password:{type:String , required:true},
    repeatPassword:{type:String , required:true}
});

const User = mongoose.model('User' , userSchema);

//Get users
router.get('/user', async (req,res)=>{
    let users = await User.find();
    res.send(users);
});

//register user
router.post('/user/register', async (req,res)=>{
    const {error} = validateUserRegisterData(req.body);

    if(error) return res.status(400).send(error.details[0].message);
    
    try {
        const user = new User({
            userName:req.body.userName,
            email:req.body.email,
            password:req.body.password,
            repeatPassword:req.body.repeatPassword
        });
        await user.save();
        res.send(user);
    } catch (err) {
        console.error("Error registering user:", err);
        res.status(500).send("Internal Server Error");
    }
});

//  login route
router.post('/user/login', async (req, res) => {
    const{error} = validateLoginData(req.body)
    if(error) res.status(400).send(error.details[0].message)
    else{
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email, password });
            if (!user) {
                return res.status(401).send("Invalid email or password");
            }
            // Store user ID in session
            req.session.userId = user._id;
            res.status(200).send("Login successful");
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    }
   
});


// Update user
router.put('/user/update/:id', async (req, res) => {
    const { error } = validateUpdateData(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { userName: req.body.userName, email: req.body.email, password: req.body.password, repeatPassword: req.body.repeatPassword },
            { new: true }
        );
        if (!user) return res.status(404).send('The user with the given ID was not found.');
        
        res.send(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.delete('/user/delete/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).send('The user with the given ID was not found');
        
        res.send(user);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});


//user logout
router.post('/user/logout/:id', (req, res) => {
    // Check if there is a user session and if the IDs match
    if (req.session && req.session.userId && req.session.userId === req.params.id) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                res.status(500).send("Internal Server Error");
            } else {
                res.status(200).send("Logout successful");
            }
        });
    } else {
        // If there is no user session or the IDs don't match, send an error response
        res.status(401).send("You are not authorized to log out");
    }
});


//validation for user registeration
const validateUserRegisterData = (user) => {
    const schema = {
        userName: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2 })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
        password: Joi.string().min(6).required(),
        repeatPassword: Joi.string().required().valid(Joi.ref('password'))
    };

    return Joi.validate(user, schema);
};

//validation for user login
const validateLoginData = (user) =>{
    const schema = {
        email: Joi.string().email({ minDomainSegments: 2 })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
        password: Joi.string().required(),
    };

    return Joi.validate(user, schema);
};

//validation for update user
const validateUpdateData = (user) =>{
    const schema = {
        userName: Joi.string().min(3).required(),
        email: Joi.string().email({ minDomainSegments: 2 })
            .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/).required(),
        password: Joi.string().min(6).required(),
        repeatPassword: Joi.string().required().valid(Joi.ref('password'))
    };

    return Joi.validate(user, schema);
};

module.exports = router;
