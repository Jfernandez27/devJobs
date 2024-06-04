const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');
const shortId = require('shortid');

const jobsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Company name is required',
        trim: true,
        minLength: 5,
    },
    company: { type: String, trim: true },
    location: { type: String, trim: true, required: 'Location is mandatory' },
    salary: { type: String, default: 0, trim: true },
    contract: { type: String, trim: true },
    description: { type: String, trim: true },
    description: { type: String },
    url: { type: String, lowercase: true },
    skills: [String],
    candidates: [
        {
            name: String,
            email: String,
            cv: String,
        },
    ],
});
jobsSchema.pre('save', function (next) {
    const url = slug(this.title);
    this.url = `${url}-${shortId.generate()}`;
    next();
});
module.exports = mongoose.model('Job', jobsSchema);
