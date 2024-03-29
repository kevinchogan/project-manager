const { Schema, model } = require("mongoose");

const projectSchema = new Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  milestones: [
    {
      type: Schema.Types.ObjectId,
      ref: "milestone",
    },
  ],
});

const Project = model("project", projectSchema);

module.exports = Project;
