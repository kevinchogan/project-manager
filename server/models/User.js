const { Schema, model } = require("mongoose");
const timeOffSchema = require("./timeOffSchema");
const bcrypt = require("bcrypt");
require("dotenv").config();

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  discipline: {
    type: Schema.Types.ObjectId,
    ref: "discipline",
  },
  time_off: [
    {
      type: timeOffSchema,
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = parseInt(process.env.SALT_ITERATION);
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;
