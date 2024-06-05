const passport = require('passport');
const mongoose = require('mongoose');
const Job = require('../models/Job');

exports.auth = passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: 'Both fields are required',
});

exports.verifyUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
};

exports.admin = async (req, res, next) => {
    const jobs = await Job.find({ author: req.user._id }).lean();

    res.render('admin', {
        pageTitle: 'Admin Panel',
        tagLine: 'Create and manage your job vacancies',
        nav: true,
        jobs,
    });
};

exports.logout = async (req, res, next) => {
    return next();
};
