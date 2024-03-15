 const express = require('express');
 const mongoose = require('mongoose');
 const session = require('express-session');
 const cookieParser = require('cookie-parser')
 const cors = require('cors');
 const bodyParser = require('body-parser')

 const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true // Allow credentials (cookies, authorization headers, etc.)
}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(session({
   secret: 'secret',
   resave: false,
   saveUninitialized: false,
   cookie: { 
     secure:false,
     maxAge: 24 * 60 * 60 * 1000 // 24 hours (in milliseconds)
 }
}));

const admins = require("./routes/admins")
const users = require("./routes/users")
const patients = require("./routes/patients")
const upload = require("./routes/upload")
const doctors = require("./routes/doctors")



mongoose.connect('mongodb://127.0.0.1/HealthLens')
.then(() => console.log('connection is successfull'))
.catch(err => console.error(`could not connect to mongodb`,err))



app.use(doctors)
app.use(upload) 
app.use(admins)
app.use(patients)
app.use(users)


 
 
const port = process.env.PORT || 3001;
app.listen(port , ()=> console.log(`Listening to port: ${port}`));