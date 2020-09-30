import { gql } from '@apollo/client';

export const RefreshTokenMutation = gql`
  mutation refreshToken($refreshToken: String!) {
    refreshAccessToken(refreshToken: $refreshToken)
  }
`;
