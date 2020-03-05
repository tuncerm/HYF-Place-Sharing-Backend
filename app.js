const express = require('express');
const bodyParser = require('body-parser');

const usersRoutes = require('./routes/users-routes');
const placesRoutes = require('./routes/places-routes');

const app = express();



app.use(bodyParser.json());

app.use('/api/users', usersRoutes);
app.use('/api/places', placesRoutes);



app.listen(5000);