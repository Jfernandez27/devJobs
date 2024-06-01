const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error', (error) => {
    console.log(`Error: ${error}`);
});

//Model Import
require('../models/Job');
