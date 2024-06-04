const express = require('express');
const homeController = require('../controllers/homeController.js');
const jobsController = require('../controllers/jobsController.js');
const usersController = require('../controllers/usersController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

module.exports = () => {
    router.get('/', homeController.showJobs);

    router.get('/jobs/new', jobsController.newJob);
    router.post('/jobs/new', jobsController.addJob);

    router.get('/jobs/:url', jobsController.showJob);

    router.get('/jobs/edit/:url', jobsController.editJob);
    router.post('/jobs/updateJob/:url', jobsController.updateJob);

    router.get('/register', usersController.register);
    router.post('/register', usersController.validate, usersController.addUser);

    //Authenticate User
    router.get('/login', usersController.login);
    router.post('/login', authController.auth);
    router.post('/recovery', usersController.passwordRecovery);

    return router;
};
