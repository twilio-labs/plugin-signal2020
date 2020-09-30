import { gql } from '@apollo/client';

export const UserProfileQuery = gql`
  query UserProfile {
    getProfile {
      id
      first_name
      hero_url
      region
      sync_token
    }
  }
`;
