const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
mongoose.Promise = global.Promise;

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },
    name: {
        type: String,
        requires: true,
        trim: true,
    },
    password: {
        type: String,
        requires: true,
        trim: true,
    },
    token: String,
    expire: Date,
});

//Password Hash
usersSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 12);
        this.password = hash;
        next();
    } else {
        return next();
    }
});

//Validate user email
usersSchema.post('save', function (error, doc, next) {
    // console.log(error);
    if (error.code === 11000) {
        next('The email is registered');
    } else {
        next(error);
    }
});

//User Authenticate
usersSchema.methods = {
    comparePassword: function (password) {
        return bcrypt.compareSync(password, this.password);
    },
};
module.exports = mongoose.model('User', usersSchema);
