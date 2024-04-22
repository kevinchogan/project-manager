import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
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
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject($name: String!, $owner: ID!, $dueDate: String!) {
    addProject(name: $name, owner: $owner, dueDate: $dueDate) {
      _id
      name
      owner {
        _id
        username
      }
      due_date
    }
  }
`;

export const ADD_MILESTONE = gql`
mutation AddMilestone($projectId: ID!, $name: String!, $dueDate: String!) {
  addMilestone(projectId: $projectId, name: $name, dueDate: $dueDate) {
    _id
    name
    project {
      _id
      name
    }
  }
}
`;

export const ADD_FEATURE = gql`
  mutation AddFeature($milestoneId: ID!, $name: String!, $owner: ID!) {
    addFeature(milestoneId: $milestoneId, name: $name, owner: $owner) {
      _id
      name
      owner {
        _id
        username
      }
      milestone {
        _id
        name
      }
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask($featureId: ID!, $taskData: TaskInput!) {
    addTask(featureId: $featureId, taskData: $taskData) {
      _id
      name
      design
      resource {
        username
      }
      estimate
      commitment
      feature {
        _id
        name
      }
    }
  }
`;

export const MOVE_FEATURE = gql`
  mutation MoveFeature($featureId: ID!, $newMilestoneId: ID!) {
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
  mutation MoveTask($taskId: ID!, $newFeatureId: ID!) {
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
  mutation UpdateTask($taskId: ID!, $taskData: TaskInput) {
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
  mutation AddPredecessor($taskId: ID!, $predId: ID!) {
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
  mutation RemovePredecessor($taskId: ID!, $predId: ID!) {
    removePredecessor(taskId: $taskId, predId: $predId) {
      _id
      name
      predecessors {
        _id
      }
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($projectId: ID!) {
    deleteProject(projectId: $projectId) {
      _id
      name
    }
  }
`;

export const DELETE_MILESTONE = gql`
  mutation DeleteMilestone($milestoneId: ID!) {
    deleteMilestone(milestoneId: $milestoneId) {
      _id
      name
    }
  }
`;

export const DELETE_FEATURE = gql`
  mutation DeleteFeature($featureId: ID!) {
    deleteFeature(featureId: $featureId) {
      _id
      name
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($taskId: ID!) {
    deleteTask(taskId: $taskId) {
      name
    }
  }
`;
