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

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      name
    }
  }
`;
