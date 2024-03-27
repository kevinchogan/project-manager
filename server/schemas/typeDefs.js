const typeDefs = `

  type User {
    _id: ID
    username: String
    email: String
    password: String
    instructor: Boolean
  }
  
  type Auth {
    token: ID
    user: User
  }

  type Milestone {
    _id: ID
    name: String
    due_date: String
    features: [ID]
  }

  type Project {
    _id: ID
    name: String
    owner: User
    due_date: String
    milestones: Milestone
  }

  type Query {
    users(id: ID): [User]
    me: User
    project(name: String!): Project
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteUser(userId: String!): User
  }
`;

module.exports = typeDefs;