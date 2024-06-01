const express = require('express');
const homeController = require('../controllers/homeController.js');
const jobsController = require('../controllers/jobsController.js');

const router = express.Router();

module.exports = () => {
    router.get('/', homeController.showJobs);

    router.get('/jobs/new', jobsController.newJob);

    return router;
};
