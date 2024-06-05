const mongoose = require('mongoose');
const Job = mongoose.model('Job');
const User = require('../models/Users');

exports.newJob = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.render('newJob', {
        pageTitle: 'New Job',
        tagLine: 'Fill out the form and publish your job vacancy',
        nav: false,
        // button: true,
        endSession: true,
        userName: user.name,
    });
};
exports.showJob = async (req, res, next) => {
    const job = await Job.findOne({ url: req.params.url }).lean();

    if (!job) return next();

    res.render('job', {
        pageTitle: job.title,
        job,
        nav: true,
        // button: true,
    });
};
exports.addJob = async (req, res) => {
    const job = new Job(req.body);

    job.author = req.user._id;

    //Create Skills array
    job.skills = req.body.skills.split(',');

    //Store
    const savedJob = await job.save();

    res.redirect(`/jobs/${savedJob.url}`);
};

exports.editJob = async (req, res, next) => {
    const job = await Job.findOne({ url: req.params.url });
    const user = await User.findById(req.user._id);

    if (!job) return next();

    res.render('editJob', {
        pageTitle: `Edit - ${job.title}`,
        job,
        nav: false,
        endSession: true,
        userName: user.name,
    });
};
exports.updateJob = async (req, res, next) => {
    const job = req.body;

    //Create Skills array
    job.skills = req.body.skills.split(',');

    //Update
    const updatedJob = await Job.findOneAndUpdate(
        { url: req.params.url },
        job,
        {
            new: true,
            runValidators: true,
        }
    );

    res.redirect(`/jobs/${updatedJob.url}`);
};
