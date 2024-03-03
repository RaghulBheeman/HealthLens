 const express = require('express');
 const mongoose = require('mongoose');
 const admins = require("./routes/admins")
 const users = require("./routes/users")
 const patients = require("./routes/patients")
 const upload = require("./routes/upload")
 const session = require('express-session');
 const cors = require('cors');

 const app = express();

 


 app.use(session({
    secret: 'pineapple sunrise beach moonlight',
    resave: false,
    saveUninitialized: false
}));

app.use(cors({
   origin: 'http://localhost:3000', // Allow requests from this origin
   credentials: true // Allow credentials (cookies, authorization headers, etc.)
 }));


 mongoose.connect('mongodb://127.0.0.1/HealthLens')
 .then(() => console.log('connection is successfull'))
 .catch(err => console.error(`could not connect to mongodb`,err))

 
//convert the data into json
app.use(express.json())

app.use(admins)
app.use(users)
app.use(patients)
app.use(upload)

const port = process.env.PORT || 3001;
app.listen(port , ()=> console.log(`Listening to port: ${port}`));