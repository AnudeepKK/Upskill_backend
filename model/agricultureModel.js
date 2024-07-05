const mongoose = require("mongoose");

const AgriSchema = new mongoose.Schema({
    skills: String,
    score: Number,
    desc: String
})

const Agriculture = mongoose.model("Agriculture", AgriSchema);

module.exports = Agriculture;