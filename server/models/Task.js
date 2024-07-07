const { Schema, model } = require("mongoose");

const taskSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  resource: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  estimate: {
    type: Number,
  },
  commitment: {
    type: Number,
  },
  actual: {
    type: Number,
    default: 0,
  },
  percent_complete: {
    type: Number,
    default: 0,
  },
  design: {
    type: String,
  },
  feature: {
    type: Schema.Types.ObjectId,
    ref: "feature",
    required: true,
  },
  predecessors: [
    {
      type: Schema.Types.ObjectId,
      ref: "task",
    },
  ],
  successors: [
    {
      type: Schema.Types.ObjectId,
      ref: "task",
    },
  ],
});

const Task = model("task", taskSchema);

module.exports = Task;
