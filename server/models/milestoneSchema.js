const { Schema } = require("mongoose");
const featureSchema = require("./featureSchema")

const milestoneSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  features: [
    {
      type: featureSchema
    },
  ],
});

module.exports = milestoneSchema;
