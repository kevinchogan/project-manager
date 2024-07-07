const {
  User,
  Discipline,
  Project,
  Task,
  Feature,
  Milestone,
} = require("../models");
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
          const projects = await Project.find(projectName)
            .populate({
              path: "owner",
              populate: { path: "discipline" },
            })
            .populate({
              path: "milestones",
              populate: {
                path: "features",
                populate: [
                  { path: "tasks" },
                  {
                    path: "owner",
                  },
                ],
              },
            });
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
      try {
        return await Discipline.find();
      } catch (error) {
        console.error("Failed to get disciplines!");
        throw new Error(`Failed to get disciplines: ${error.message}`);
      }
    },
    tasks: async (parent, { id }, context) => {
      if (context.user) {
        try {
          const taskId = id ? { _id: id } : {};
          return await Task.find(taskId)
            .populate("resource")
            .populate("feature");
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
          return await Task.find({ resource: resourceId })
            .populate("resource")
            .populate("feature");
        } catch (error) {
          console.error("Invalid task resource!");
          throw new Error(`Failed to get tasks: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    featuresByResource: async (parent, { resourceId }, context) => {
      if (context.user) {
        try {
          const tasks = await Task.find({ resource: resourceId });
          const featureIds = [
            ...new Set(tasks.map((task) => task.feature.toString())),
          ];
          const features = await Feature.find({ _id: { $in: featureIds } })
            .populate({
              path: "tasks",
              populate: { path: "resource" },
            })
            .populate("owner")
            .populate("milestone");
          return features;
        } catch (error) {
          console.error("Invalid feature resource!");
          throw new Error(`Failed to get features: ${error.message}`);
        }
      }
      throw AuthenticationError(
        "You must be logged in to perform this action."
      );
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
    addProject: async (parent, { name, owner, dueDate }, context) => {
      if (context.user) {
        try {
          let project = await Project.create({
            name: name,
            owner: owner,
            due_date: dueDate,
          });
          project = await Project.findById(project._id).populate("owner");
          return project;
        } catch (error) {
          console.error("Failed to add project!");
          throw new Error(`Failed to add project: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    addMilestone: async (parent, { projectId, name, dueDate }, context) => {
      if (context.user) {
        try {
          const project = await Project.findById(projectId);
          if (!project) {
            console.error("Project not found");
            throw new Error("Project not found");
          }
          let milestone = await Milestone.create({
            name: name,
            due_date: dueDate,
            project: projectId,
          });
          await Project.findByIdAndUpdate(projectId, {
            $push: { milestones: milestone._id },
          });
          milestone = await Milestone.findById(milestone._id).populate(
            "project"
          );
          return milestone;
        } catch (error) {
          console.error("Failed to add milestone!");
          throw new Error(`Failed to add milestone: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    addFeature: async (parent, { milestoneId, name, owner }, context) => {
      if (context.user) {
        try {
          const milestone = await Milestone.findById(milestoneId);
          if (!milestone) {
            console.error("Milestone not found");
            throw new Error("Milestone not found");
          }
          let feature = await Feature.create({
            name: name,
            owner: owner,
            milestone: milestoneId,
          });
          await Milestone.findByIdAndUpdate(
            { _id: milestoneId },
            { $push: { features: feature._id } }
          );
          feature = await Feature.findById(feature._id)
            .populate("owner")
            .populate("milestone");
          return feature;
        } catch (error) {
          console.error("Failed to add feature!");
          throw new Error(`Failed to add feature: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    addTask: async (parent, { featureId, taskData }, context) => {
      if (context.user) {
        try {
          const feature = await Feature.findById(featureId);
          if (!feature) {
            console.error("Feature not found");
            throw new Error("Feature not found");
          }
          taskData.feature = featureId;
          let task = await Task.create(taskData);
          await Feature.findOneAndUpdate(
            { _id: featureId },
            { $push: { tasks: task._id } }
          );
          task = await Task.findById(task._id)
            .populate("resource")
            .populate("feature");
          return task;
        } catch (error) {
          console.error("Failed to add task!");
          throw new Error(`Failed to add task: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    addDiscipline: async (parent, { name }, context) => {
      if (context.user) {
        try {
          let discipline = await Discipline.create({ name });
          return discipline;
        } catch (error) {
          console.error("Failed to add discipline!");
          throw new Error(`Failed to add discipline: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    moveFeature: async (parent, { featureId, newMilestoneId }, context) => {
      if (context.user) {
        try {
          const feature = await Feature.findById(featureId);
          if (!feature) {
            console.error("Feature not found");
            throw new Error("Feature not found");
          }
          const oldMilestoneId = feature.milestone;
          const oldMilestone = await Milestone.findByIdAndUpdate(
            oldMilestoneId,
            { $pull: { features: feature._id } },
            { new: true }
          );
          const newMilestone = await Milestone.findByIdAndUpdate(
            newMilestoneId,
            { $push: { features: feature._id } },
            { new: true }
          );
          feature.milestone = newMilestoneId;

          await feature.save();

          return feature;
        } catch (error) {
          console.error("Failed to move feature!");
          throw new Error(`Failed to move feature:  ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    moveTask: async (parent, { taskId, newFeatureId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!taskId) {
            console.error("Task not found");
            throw new Error("Task not found");
          }
          const oldFeatureId = task.feature;
          const oldFeature = await Feature.findByIdAndUpdate(
            oldFeatureId,
            { $pull: { tasks: task._id } },
            { new: true }
          );
          const newFeature = await Feature.findByIdAndUpdate(
            newFeatureId,
            { $push: { tasks: task._id } },
            { new: true }
          );
          task.feature = newFeatureId;

          await task.save();

          return task;
        } catch (error) {
          console.error("Failed to move task!");
          throw new Error(`Failed to move task:  ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    updateTask: async (parent, { taskId, taskData }, context) => {
      if (context.user) {
        try {
          const task = await Task.findByIdAndUpdate(
            taskId,
            { ...taskData },
            { new: true }
          );
          return task;
        } catch (error) {
          console.error("Failed to update task!");
          throw new Error(`Failed top update task: ${error.message}`);
        }
      }
    },
    updateDiscipline: async (parent, { discId, name }, context) => {
      if (context.user) {
        try {
          const discipline = await Discipline.findByIdAndUpdate(
            discId,
            { name },
            { new: true }
          );
          return discipline;
        } catch (error) {
          console.error("Failed to update discipline!");
          throw new Error(`Failed top update discipline: ${error.message}`);
        }
      }
    },
    addPredecessor: async (parent, { taskId, predId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!task) {
            throw new Error("Task not found");
          }
          if (task.predecessors.includes(predId)) {
            throw new Error(
              "This predecessor is already present for this task"
            );
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { predecessors: predId } },
            { new: true }
          );
          await Task.findByIdAndUpdate(
            predId,
            { $push: { successors: taskId } },
            { new: true }
          );
          return updatedTask;
        } catch (error) {
          console.error("Add predecessor failed!");
          throw new Error(`Add predecessor failed: ${error.message}`);
        }
      }
    },
    removePredecessor: async (parent, { taskId, predId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!task) {
            throw new Error("Task not found");
          }
          if (!task.predecessors.includes(predId)) {
            throw new Error("Predecessor not found in the task");
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { predecessors: predId } },
            { new: true }
          );
          await Task.findByIdAndUpdate(
            predId,
            { $pull: { successors: taskId } },
            { new: true }
          );
          return updatedTask;
        } catch (error) {
          console.error("Remove predecessor failed!");
          throw new Error(`Remove predecessor failed: ${error.message}`);
        }
      }
    },
    addSuccessor: async (parent, { taskId, succId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!task) {
            throw new Error("Task not found");
          }
          if (task.successors.includes(succId)) {
            throw new Error(
              "This successor is already present for this task"
            );
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $push: { successors: succId } },
            { new: true }
          );
          await Task.findByIdAndUpdate(
            succId,
            { $push: { predecessors: taskId } },
            { new: true }
          );
          return updatedTask;
        } catch (error) {
          console.error("Add successor failed!");
          throw new Error(`Add successor failed: ${error.message}`);
        }
      }
    },
    removeSuccessor: async (parent, { taskId, succId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findById(taskId);
          if (!task) {
            throw new Error("Task not found");
          }
          if (!task.successors.includes(succId)) {
            throw new Error("Successor not found in the task");
          }
          const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { $pull: { successors: succId } },
            { new: true }
          );
          await Task.findByIdAndUpdate(
            succId,
            { $pull: { predecessors: taskId } },
            { new: true }
          );
          return updatedTask;
        } catch (error) {
          console.error("Remove successor failed!");
          throw new Error(`Remove successor failed: ${error.message}`);
        }
      }
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
    deleteProject: async (parent, { projectId }, context) => {
      if (context.user) {
        try {
          const milestones = await Milestone.find({ project: projectId });
          const milestoneIds = milestones.map((milestone) => milestone._id);

          const features = await Feature.find({
            milestone: { $in: milestoneIds },
          });
          const featureIds = features.map((feature) => feature._id);

          const tasks = await Task.find({ feature: { $in: featureIds } });
          const taskIds = tasks.map((task) => task._id);

          if (taskIds.length > 0) {
            await Task.deleteMany({ _id: { $in: taskIds } });
          }
          if (featureIds.length > 0) {
            await Feature.deleteMany({ _id: { $in: featureIds } });
          }
          if (milestoneIds.length > 0) {
            await Milestone.deleteMany({ _id: { $in: milestoneIds } });
          }

          const project = await Project.findOneAndDelete({ _id: projectId });
          if (!project) {
            throw new Error("Project not found or already deleted");
          }

          return project;
        } catch (error) {
          console.error("Failed to delete project!");
          throw new Error(`Failed to delete project: ${error.message}`);
        }
      }
      throw new Error("You must be logged in to perform this action.");
    },
    deleteMilestone: async (parent, { milestoneId }, context) => {
      if (context.user) {
        try {
          const features = await Feature.find({ milestone: milestoneId });
          const taskIds = features.flatMap((feature) => feature.tasks);
          if (taskIds.length > 0) {
            await Task.deleteMany({ _id: { $in: taskIds } });
          }
          await Feature.deleteMany({ milestone: milestoneId });

          const milestone = await Milestone.findOneAndDelete({
            _id: milestoneId,
          });
          if (!milestone) {
            throw new Error("Milestone not found or already deleted");
          }
          return milestone;
        } catch (error) {
          console.error("Failed to delete milestone!");
          throw new Error(`Failed to delete milestone: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    deleteFeature: async (parent, { featureId }, context) => {
      if (context.user) {
        try {
          const feature = await Feature.findOneAndDelete({ _id: featureId });
          if (!feature) {
            console.error("Feature not found or already deleted");
            throw new Error("Feature not found or already deleted");
          }
          await Task.deleteMany({ feature: featureId });
          return feature;
        } catch (error) {
          console.error("Failed to delete feature!");
          throw new Error(`Failed to delete feature: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    deleteTask: async (parent, { taskId }, context) => {
      if (context.user) {
        try {
          const task = await Task.findOneAndDelete({ _id: taskId });
          if (!task) {
            throw new Error("Task not found or already deleted");
          }
          return task;
        } catch (error) {
          console.error("Failed to delete task!");
          throw new Error(`Failed to delete task: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },
    deleteDiscipline: async (parent, { discId }, context) => {
      if (context.user) {
        try {
          const discipline = await Discipline.findOneAndDelete({ _id: discId });
          if (!discipline) {
            throw new Error("Discipline not found or already deleted");
          }
          return discipline;
        } catch (error) {
          console.error("Failed to delete discipline!");
          throw new Error(`Failed to delete discipline: ${error.message}`);
        }
      }
      throw AuthenticationError;
    },    
  },
};

module.exports = resolvers;
