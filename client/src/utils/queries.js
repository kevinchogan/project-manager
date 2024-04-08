import { gql } from "@apollo/client";

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
      discipline {
        name
      }
    }
  }
`;

export const GET_ME = gql`
  query me {
    me {
      _id
      discipline {
        name
      }
      email
      username
    }
  }
`;

export const GET_DISCIPLINES = gql`
  query disciplines {
    disciplines {
      name
    }
  }
`;

export const GET_TASKS = gql`
  query tasks {
    tasks {
      _id
      name
      design
      resource {
        _id
        username
      }
      estimate
      commitment
      percent_complete
      actual
    }
  }
`;

export const GET_TASK = gql`
  query task($tasksId: ID) {
    tasks(id: $tasksId) {
      name
      design
      resource {
        _id
        username
      }
      estimate
      commitment
      percent_complete
      actual
    }
  }
`;

export const GET_PROJECTS = gql`
  query projects {
    projects {
      _id
      name
      owner {
        username
      }
      due_date
      milestones {
        _id
        name
        due_date
        features {
          _id
          name
          owner {
            username
          }
          tasks {
            _id
            name
          }
        }
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query project($name: String) {
    projects(name: $name) {
      _id
      name
      owner {
        username
      }
      due_date
      milestones {
        _id
        name
        due_date
        features {
          _id
          name
          owner {
            username
          }
          tasks {
            _id
            name
          }
        }
      }
    }
  }
`;

export const TASKS_BY_RESOURCE = gql`
  query tasksByResource($resourceId: ID!) {
    tasksByResource(resourceId: $resourceId) {
      _id
      name
      design
      estimate
      commitment
      percent_complete
      actual
      predecessors {
        _id
        name
        resource {
          username
        }
      }
    }
  }
`;

export const FEATURES_BY_RESOURCE = gql`
  query featuresByResource($resourceId: ID!) {
    featuresByResource(resourceId: $resourceId) {
      _id
      name
      owner {
        username
      }
      tasks {
        name
        resource {
          username
        }
      }
    }
  }
`;
