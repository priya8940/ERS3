const express=require('express')
const db=require('./config/db');
const cookieParser=require('cookie-parser');
const app=express();
//importing rauter
const empRoute=require('./routes/empRaute');
const reviewRaute=require('./routes/reviewRaute');

//import cors to enable cors origin requests 
const cors=require('cors');
app.use(cors({
    origin:'http://localhost:5500',
    credentials:true,
}));
  
app.use(cookieParser());
app.use(express.json());
//creating url permenetly
app.use('/v1/employees/',empRoute);
app.use('/v1/reviews/',reviewRaute);

app.listen('8000');
