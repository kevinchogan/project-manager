const { Schema, model } = require("mongoose");

const discSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const Discipline = model("discipline", discSchema);

module.exports = Discipline;
