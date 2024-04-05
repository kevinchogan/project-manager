const typeDefs = `
  type Discipline {
    _id: ID
    name: String
  }

  type User {
    _id: ID
    username: String
    email: String
    password: String
    discipline: Discipline
  }
  
  type Auth {
    token: ID
    user: User
  }

  type Task {
    _id: ID
    name: String
    resource: User
    estimate: Float
    commitment: Float
    actual: Float
    percent_complete: Float
    design: String
    predecessors: [Task]
  }

  type Feature {
    name: String
    owner: User
    tasks: [Task]
  }

  type Milestone {
    name: String
    due_date: String
    features: [Feature]
  }

  type Project {
    _id: ID
    name: String
    owner: User
    due_date: String
    milestones: [Milestone]
  }

  type Query {
    users(id: ID): [User]
    me: User
    projects(name: String): [Project]
    disciplines: [Discipline]
    tasks(id: ID): [Task]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    deleteUser(userId: String!): User
  }
`;

module.exports = typeDefs;