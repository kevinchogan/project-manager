const typeDefs = `
  type Discipline {
    _id: ID
    name: String
  }

  type User {
    _id: ID
    username: String
    email: String
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
    feature: Feature
    predecessors: [Task]
  }

  type Feature {
    _id: ID
    name: String
    owner: User
    milestone: Milestone
    tasks: [Task]
  }

  type Milestone {
    _id: ID
    name: String
    due_date: String
    project: Project
    features: [Feature]
  }

  type Project {
    _id: ID
    name: String
    owner: User
    due_date: String
    milestones: [Milestone]
  }

  input TaskInput {
    name: String
    resource: ID
    estimate: Float
    commitment: Float
    actual: Float
    percent_complete: Float
    design: String
    predecessors: [ID]
  }

  type Query {
    users(id: ID): [User]
    me: User
    projects(name: String): [Project]
    disciplines: [Discipline]
    tasks(id: ID): [Task]
    tasksByResource(resourceId: ID!): [Task]
    featuresByResource(resourceId: ID!): [Feature]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    addTask(featureId: ID!, taskData: TaskInput!): Task
    login(email: String!, password: String!): Auth
    moveFeature(featureId: ID!, newMilestoneId: ID!): Feature
    deleteUser(userId: ID!): User
    deleteTask(taskId: ID!): Task
  }
`;

module.exports = typeDefs;