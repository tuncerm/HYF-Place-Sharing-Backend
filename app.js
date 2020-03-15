const express = require('express');
const bodyParser = require('body-parser');
const mongoose  = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');
const HttpError = require('./models/http-error');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next)=>{
    next(new HttpError("Not Found", 404));
})

app.use((error, req, res, next)=>{
    if(res.headerSend){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "Something went wrong!"})
});
const URL = 'mongodb+srv://hyftest:test0102@testbed-qtc2h.azure.mongodb.net/hyfplaces?retryWrites=true&w=majority'
mongoose
    .connect(URL)
    .then(()=>{
        app.listen(5000);
    })
    .catch(console.error);
