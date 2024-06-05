const passport = require('passport');
const mongoose = require('mongoose');
const Job = require('../models/Job');
const User = require('../models/Users');

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
    const user = await User.findById(req.user._id);

    res.render('admin', {
        pageTitle: 'Admin Panel',
        tagLine: 'Create and manage your job vacancies',
        nav: false,
        jobs,
        endSession: true,
        userName: user.name,
    });
};

exports.logout = async (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
    req.flash('correcto', 'Logging out');
    res.redirect('/login');
};
