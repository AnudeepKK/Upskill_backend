const mongoose = require('mongoose');

// Define schema for the skills collection
const skillSchema = new mongoose.Schema({
  name: String,
  score: Number,
  desc: String
});

// Create a model based on the schema
const Skill = mongoose.model('Skills', skillSchema);

module.exports = Skill; // Export the model to be used elsewhere
