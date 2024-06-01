exports.showJobs = (req, res) => {
    res.render('home', {
        pageTitle: 'devJobs',
        tagLine: 'Find and post jobs for web developers',
        nav: true,
        button: true,
    });
};
