import { LoginQuery } from '../queries/login';
import { RefreshTokenMutation } from '../queries/refreshToken';
import { client } from '../utils/graphqlClient';

export async function login(email: string, password: string) {
  const result = await client().query({
    query: LoginQuery,
    variables: { email, password },
  });

  return (result.data || {}).attendeeLogin;
}

export async function refreshToken(refreshToken: string) {
  const result = await client().mutate({
    mutation: RefreshTokenMutation,
    variables: { refreshToken },
  });

  return result.data?.refreshAccessToken;
}
