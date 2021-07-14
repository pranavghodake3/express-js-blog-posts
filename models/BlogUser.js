const mongoose = require('mongoose');
// Define schema
var Schema = mongoose.Schema;

var BlogUserSchema = new Schema({
  first_name: String,
  last_name: String,
  email: String,
  password: String,
});

// Compile model from schema
module.exports = mongoose.model('BlogUser', BlogUserSchema );