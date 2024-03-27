const { Schema } = require("mongoose");

const timeOffSchema = new Schema({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

module.exports = timeOffSchema;
