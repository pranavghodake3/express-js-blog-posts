const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

// Define schema
var Schema = mongoose.Schema;

var BlogUserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
});

BlogUserSchema.pre("save", function (next) {
    const user = this

    if (this.isModified("password") || this.isNew) {
        bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
            return next(saltError)
        } else {
            bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
                return next(hashError)
            }

            user.password = hash
            next()
            })
        }
        })
    } else {
        return next()
    }
});

BlogUserSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(error, isMatch) {
        if (error) {
            return callback(error)
        } else {
            callback(null, isMatch)
        }
    })
}

// Compile model from schema
module.exports = mongoose.model('BlogUser', BlogUserSchema );