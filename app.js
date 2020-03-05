const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');

const app = express();



app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);

app.use((error, req, res, next)=>{
    if(res.headerSend){
        return next(error);
    }
    res.status(error.code || 500).json({message: error.message || "Something went wrong!"})
});

app.listen(5000);