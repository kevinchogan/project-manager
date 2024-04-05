const { Schema, model } = require("mongoose");
const milestoneSchema = require("./milestoneSchema")

const projectSchema = new Schema({
  name: {
    type: String,
    required: true,
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
      type: milestoneSchema,
    },
  ],
});

const Project = model("project", projectSchema);

module.exports = Project;
