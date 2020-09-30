import { gql } from '@apollo/client';

export const LoginQuery = gql`
  query login($email: String!, $password: String!) {
    attendeeLogin(email: $email, password: $password) {
      access_token
      refresh_token
      first_name
      region
    }
  }
`;
