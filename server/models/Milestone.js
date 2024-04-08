const { Schema, model } = require("mongoose");

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
      type: Schema.Types.ObjectId,
      ref: "feature"
    },
  ],
});

const Milestone = model("milestone", milestoneSchema)

module.exports = Milestone;
