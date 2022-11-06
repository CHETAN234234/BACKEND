const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const cors  =require('cors');
// Template engine
app.set('views',path.join(__dirname, '/views'));
app.set('view engine','ejs');
const connectDB = require('./config/db');
app.use(express.static('public'));
app.use(express.json());

//cors
// const corsOptions = {
//     origin  : process.env.ALLOWED_CLIENTS.split(',')
    
// }
// app.use(cors(corsOptions));
//Route
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/file/download', require('./routes/download'));

connectDB();
app.listen(PORT, ()=>{
    console.log(`Listening on part ${PORT} 👍👍`);
})  