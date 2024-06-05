const express = require('express');
const homeController = require('../controllers/homeController.js');
const jobsController = require('../controllers/jobsController.js');
const usersController = require('../controllers/usersController.js');
const authController = require('../controllers/authController.js');

const router = express.Router();

module.exports = () => {
    router.get('/', homeController.showJobs);

    router.get('/jobs/new', authController.verifyUser, jobsController.newJob);
    router.post(
        '/jobs/new',
        authController.verifyUser,
        jobsController.validateJob,
        jobsController.addJob
    );

    router.get('/jobs/:url', jobsController.showJob);

    router.get(
        '/jobs/edit/:url',
        authController.verifyUser,
        jobsController.editJob
    );
    router.post(
        '/jobs/updateJob/:url',
        authController.verifyUser,
        jobsController.validateJob,
        jobsController.updateJob
    );

    router.get('/register', usersController.register);
    router.post('/register', usersController.validate, usersController.addUser);

    //Authenticate User
    router.get('/login', usersController.login);
    router.post('/login', authController.auth);
    router.post('/recovery', usersController.passwordRecovery);

    router.get('/logout', authController.verifyUser, authController.logout);

    //Admin Panel
    router.get('/admin', authController.verifyUser, authController.admin);

    // Profiles
    router.get(
        '/profile/edit',
        authController.verifyUser,
        usersController.profileEdit
    );
    router.post(
        '/profile/edit',
        authController.verifyUser,
        usersController.validateProfile,
        usersController.profileUpdate
    );

    return router;
};
