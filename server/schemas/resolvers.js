const { User, Discipline, Project, Task } = require("../models");
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
    projects: async (parent, { name }, context) => {
      if (context.user) {
        try {
          const projectName = name ? { name: name } : {};
          const projects =  await Project.find(projectName)
          .populate({
            path: "owner",
            populate: {path: "discipline"}
          });

          for (let project of projects) {
            for (let milestone of project.milestones) {
              for (let feature of milestone.features) {
                feature.owner = await User.findById(feature.owner);
                const populatedTasks = [];
                for (let taskId of feature.tasks) {
                  let task = await Task.findById(taskId);
                  task.resource = await User.findById(task.resource);
                  task.resource.discipline = await Discipline.findById(task.resource.discipline);
                  populatedTasks.push(task);
                }
                feature.tasks = populatedTasks;
              }
            }
          }

          return projects;
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
    tasks: async (parent, { id }, context) => {
      if (context.user) {
        try {
          const taskId = id ? { _id: id } : {};
          return await Task.find(taskId).populate("resource");
        } catch (error) {
          if (id) {
            console.error("Invalid task ID!");
            throw new Error(`Failed to get task: ${error.message}`);
          } else {
            console.error("Failed to get all tasks!");
            throw new Error(`Failed to get all tasks: ${error.message}`);
          }
        }
      }
      throw AuthenticationError;
    },
    tasksByResource: async (parent, { resourceId }, context) => {
      if (context.user) {
        try {
          return await Task.find({resource: resourceId}).populate("resource");
        } catch (error) {
          console.error("Invalid task resource!");
          throw new Error(`Failed to get task: ${error.message}`);
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
