const { Schema, model } = require("mongoose");

const featureSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: "task",
    },
  ],
});

const Feature = model("feature", featureSchema);

module.exports = Feature;
