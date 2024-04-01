const { User, Discipline, Project } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async (parent, { id }, context) => {
      if (context.user) {
        try {
          const userId = id ? { _id: id } : {};
          return await User.find(userId).populate("discipline");
        } catch (error) {
          if (id) {
            console.error("Invalid user ID!");
            throw new Error(`Failed to get user: ${error.message}`);
          } else {
            console.error("Failed to get all users!");
            throw new Error(`Failed to get all users: ${error.message}`);
          }
        }
      }
      throw AuthenticationError;
    },
    // Query to retrieve the logged in user
    me: async (parent, args, context) => {
      if (context.user) {
        try {
          return User.findOne({ _id: context.user._id }).populate("discipline");
        } catch (error) {
          console.error("Failed to get logged in user!");
          throw new Error(`Failed to get user: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    project: async (Parent, { name }, context) => {
      if (context.user) {
        try {
          const projectName = name ? { name: name } : {};
          return await Project.find(projectName);
        } catch (error) {
          if (name) {
            console.error("Invalid project name!");
            throw new Error(`Failed to get project: ${error.message}`);
          } else {
            console.error("Failed to get all projects!");
            throw new Error(`Failed to get all projects: ${error.message}`);
          }          
        }
      }
      throw AuthenticationError;
    },
    disciplines: async (Parent, args, context) => {
      if (context.user) {
        try {
          return await Discipline.find();
        } catch (error) {
          console.error("Failed to get disciplines!");
          throw new Error(`Failed to get disciplines: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email }).populate("discipline");

      if (!user) {
        throw AuthenticationError;
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError;
      }

      const token = signToken(user);

      return { token, user };
    },
    deleteUser: async (parent, { userId }, context) => {
      if (context.user) {
        try {
          return User.findOneAndDelete({ _id: userId });
        } catch (error) {
          console.error("Failed to delete user!");
          throw new Error(`Failed to delete user: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
  },
};

module.exports = resolvers;
