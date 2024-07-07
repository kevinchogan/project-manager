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
    successors: [Task]
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
    login(email: String!, password: String!): Auth
    addProject(name: String!, owner: ID!, dueDate: String!): Project
    addMilestone(projectId: ID!, name: String!, dueDate: String!): Milestone
    addFeature(milestoneId: ID!, name: String!, owner:ID!): Feature
    addTask(featureId: ID!, taskData: TaskInput!): Task
    addDiscipline(name: String!): Discipline
    moveFeature(featureId: ID!, newMilestoneId: ID!): Feature
    moveTask(taskId: ID!, newFeatureId: ID!): Task
    updateTask(taskId: ID!, taskData: TaskInput): Task
    updateDiscipline(discId: ID!, name: String): Discipline
    addPredecessor(taskId: ID!, predId: ID!): Task
    removePredecessor(taskId: ID!, predId: ID!): Task
    addSuccessor(taskId: ID!, succId: ID!): Task
    removeSuccessor(taskId: ID!, succId: ID!): Task
    deleteUser(userId: ID!): User
    deleteProject(projectId: ID!): Project
    deleteMilestone(milestoneId: ID!): Milestone
    deleteFeature(featureId: ID!): Feature
    deleteTask(taskId: ID!): Task
    deleteDiscipline(discId: ID!): Discipline
  }
`;

module.exports = typeDefs;