const mongoose = require('mongoose');
const Job = mongoose.model('Job');
const ObjectId = require('mongodb').ObjectId;
// const {ObjectId} = require('mongodb');
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
    const job = await Job.findOne(
        { url: req.params.url },
        { status: 'Active' }
    ).lean();

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
    const job = await Job.findOne(
        { url: req.params.url },
        { status: 'active' }
    ).lean();
    const user = await User.findById(req.user._id).lean();

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

exports.delete = async (req, res, next) => {
    const { id } = req.params;
    // const id = ObjectId(req.params.id);

    const job = await Job.findById({ id });
    if (!verifyAuthor(job, req.user)) {
        res.status(403).send('Error');
    }

    const removed = Job.findOneAndUpdate({ status: 'deleted' }, job);

    console.log(removed);
    if (!removed) {
        res.status(500).send('Algo');
    }
    res.status(200).send('Job Deleted');
};

exports.validateJob = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    //sanitize
    req.sanitizeBody('title').escape();
    req.sanitizeBody('company').escape();
    req.sanitizeBody('location').escape();
    req.sanitizeBody('salary').escape();
    req.sanitizeBody('contract').escape();
    req.sanitizeBody('skills').escape();

    //Validate
    req.checkBody('title', 'Add a title for the job').notEmpty();
    req.checkBody('company', 'Add a company for the job').notEmpty();
    req.checkBody('location', 'Add a location for the job').notEmpty();
    req.checkBody('contract', 'Select a valid contract type').notEmpty();
    req.checkBody('skills', 'Add at least one skill').notEmpty();

    const errors = req.validationErrors();

    if (errors) {
        req.flash(
            'error',
            errors.map((error) => error.msg)
        );
        res.render('newJob', {
            pageTitle: 'New Job',
            tagLine: 'Fill out the form and publish your job vacancy',
            nav: false,
            // button: true,
            endSession: true,
            userName: user.name,
            messages: req.flash(),
            job: req.body,
        });

        return;
    }

    next();
};

const verifyAuthor = (job = {}, user = {}) => {
    if (job.author.equals(user._id)) {
        return true;
    } else {
        return false;
    }
};
