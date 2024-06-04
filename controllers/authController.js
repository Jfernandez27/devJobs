const passport = require('passport');

exports.auth = passport.authenticate('local', {
    successRedirect: '/ok',
    failureRedirect: '/login',
    failureFlash: true,
});

exports.logout = async (req, res, next) => {
    return next();
};
