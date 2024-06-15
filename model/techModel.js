const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

// Define the schema for the tech collection
const techSchema = new Schema({
  skill: {
    type: String,
    required: true
  },
  skilltolearn: {
    type: [String], // Assuming skilltolearn is an array of strings
    required: true
  },
  desc :{
    type:String
  }
});

// Create a model from the schema
const Tech = mongoose.model('Tech', techSchema);

module.exports = Tech;
