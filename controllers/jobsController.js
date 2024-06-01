exports.newJob = (req, res) => {
    res.render('newJob', {
        pageTitle: 'New Job',
        tagLine: 'Fill out the form and publish your job vacancy',
        // nav: true,
        // button: true,
    });
};
