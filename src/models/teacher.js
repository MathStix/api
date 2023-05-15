const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const teacherSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true,  match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]  },
    password: String,
}, { collection: 'teachers' });

teacherSchema.pre('save', function (next) {
    console.log("pre save");
    var teacher = this;

    if (!teacher.isModified('password')) return next();
    console.log("pre save 2");

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(teacher.password, salt, function (err, hash) {
            if (err) return next(err);
            // Override hashed password with plain password
            teacher.password = hash;
            next();
        });
    });
});

teacherSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            console.log(err);
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Teacher', teacherSchema);