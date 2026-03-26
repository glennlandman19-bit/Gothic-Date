'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route imports
// const exampleRoute = require('./routes/example');
// app.use('/api/example', exampleRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Gothic-Date API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
