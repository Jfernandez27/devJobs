const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.register = async (req, res, next) => {
    res.render('register', {
        pageTitle: 'Create your account on devJobs',
        tagLine:
            'Start posting your job vacancies for free, you just have to register',
    });
};
exports.addUser = async (req, res, next) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.log(error);
        req.flash('error', error);
        res.redirect('/register');
    }
};

exports.validate = (req, res, next) => {
    //Sanitize
    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmPassword').escape();

    //Validate
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Not a valid Email').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirmPassword', 'Confirm Password is required').notEmpty();
    req.checkBody('confirmPassword', "Password didn't match").equals(
        req.body.password
    );

    const errors = req.validationErrors();

    if (errors) {
        req.flash(
            'error',
            errors.map((error) => error.msg)
        );
        res.render('register', {
            pageTitle: 'Create your account on devJobs',
            tagLine:
                'Start posting your job vacancies for free, you just have to register',
            messages: req.flash(),
        });
        return;
    }

    next();
};

exports.login = async (req, res, next) => {
    res.render('login', {
        pageTitle: 'devJobs Login',
    });
};

exports.profileEdit = async (req, res, next) => {
    const user = await User.findById(req.user._id).lean();

    res.render('profileEdit', {
        pageTitle: 'Profile Edit',
        user,
        endSession: true,
        userName: user.name,
    });
};

exports.profileUpdate = async (req, res, next) => {
    const user = await User.findById(req.user._id);

    user.name = req.body.name;
    user.email = req.body.email;
    if (req.body.password) {
        user.password = req.body.password;
    }
    await user.save();

    req.flash('correcto', 'Profile Updated!!!!');
    res.redirect('/admin');
};

exports.passwordRecovery = async (req, res, next) => {
    return next();
};

exports.validateProfile = async (req, res, next) => {
    const user = await User.findById(req.user._id).lean();

    //sanitize
    req.sanitizeBody('name').escape();
    req.sanitizeBody('email').escape();
    if (req.body.password) {
        req.sanitizeBody('password').escape();
    }

    //Validate
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Not a valid Email').isEmail();

    const errors = req.validationErrors();

    if (errors) {
        req.flash(
            'error',
            errors.map((error) => error.msg)
        );
        res.render('profileEdit', {
            pageTitle: 'Profile Edit',
            user,
            endSession: true,
            userName: user.name,
            messages: req.flash(),
        });

        return;
    }

    next();
};
