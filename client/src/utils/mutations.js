import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation addTask($featureId: ID!, $taskData: TaskInput!) {
    addTask(featureId: $featureId, taskData: $taskData) {
      _id
      name
      design
      resource {
        username
      }
      estimate
      commitment
    }
  }
`;

export const MOVE_FEATURE = gql`
  mutation moveFeature($featureId: ID!, $newMilestoneId: ID!) {
    moveFeature(featureId: $featureId, newMilestoneId: $newMilestoneId) {
      _id
      milestone {
        _id
      }
      name
    }
  }
`;

export const MOVE_TASK = gql`
  mutation moveTask($taskId: ID!, $newFeatureId: ID!) {
    moveTask(taskId: $taskId, newFeatureId: $newFeatureId) {
      _id
      name
      feature {
        _id
      }
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation updateTask($taskId: ID!, $taskData: TaskInput) {
    updateTask(taskId: $taskId, taskData: $taskData) {
      _id
      name
      estimate
      commitment
      percent_complete
      actual
      design
      resource {
        _id
      }
      predecessors {
        _id
      }
    }
  }
`;

export const ADD_PREDECESSOR = gql`
  mutation addPredecessor($taskId: ID!, $predId: ID!) {
    addPredecessor(taskId: $taskId, predId: $predId) {
      _id
      name
      predecessors {
        _id
      }
    }
  }
`;

export const REMOVE_PREDECESSOR = gql`
mutation removePredecessor($taskId: ID!, $predId: ID!) {
  removePredecessor(taskId: $taskId, predId: $predId) {
    _id
    name
    predecessors {
      _id
    }
  }
}
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      name
    }
  }
`;
