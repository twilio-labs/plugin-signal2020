import { gql } from '@apollo/client';

export const SessionsQuery = gql`
  # Write your query or mutation here
  query GetSessions {
    getPublicSessions {
      id
      start_date
      end_date
      title
      description
      speakers {
        name
      }
      tags {
        name
      }
    }
    getAttendeeCalendar {
      id
      start_date
      end_date
      title
      description
      speakers {
        name
      }
      tags {
        name
      }
    }
  }
`;

export const RegisterForSessionQuery = gql`
  mutation registerToSession($sessionId: String!) {
    registerToSession(sessionId: $sessionId)
  }
`;

export const UnregisterForSessionQuery = gql`
  mutation unregisterFromSession($sessionId: String!) {
    unregisterFromSession(sessionId: $sessionId)
  }
`;
