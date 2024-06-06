const mongoose = require('mongoose');
const Job = mongoose.model('Job');

exports.showJobs = async (req, res, next) => {
    const jobs = await Job.find({ status: 'Active' }).lean();

    if (!jobs) return next();

    res.render('home', {
        pageTitle: 'devJobs',
        tagLine: 'Find and post jobs for web developers',
        nav: true,
        button: true,
        jobs,
    });
};
