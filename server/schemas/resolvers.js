const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async (parent, { id }, context) => {
      if (context.user) {
        try {
          const userId = id ? { _id: id } : {};
          return await User.find(userId)
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
          return User.findOne({ _id: context.user._id })
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
          return await Project.find({name: name}).populate("milestones");
        } catch (error) {
          console.error("Invalid project name!");
          throw new Error(`Failed to get project: ${error.message}`);
        }
      }
      throw AuthenticationError;
    }
},
    
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
          },
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
      
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