import client from '../client.service';

export interface IRetrieveTokensResponse {
  access: string | null;
  refresh: string | null;
}

export const retrieveTokens = (data: {
  username: string;
  password: string;
}) => {
  return client.post<IRetrieveTokensResponse, typeof data>(
    '/users/auth/token/obtain',
    {
      ...data,
    }
  );
};

export interface IUser {
  username: string;
  email: string;
  id: number;
}

export interface ICreateUserResponse extends IRetrieveTokensResponse {
  user: IUser | null;
}

export const createUser = (data: {
  username: string;
  password: string;
  email: string;
  machine_id: string;
}) => {
  return client.post<ICreateUserResponse, typeof data>('/users/user', {
    ...data,
  });
};

export interface IGetUserFromTokenResponse extends IUser {}

export const getUserFromToken = (accessToken: string) => {
  return client.get<IGetUserFromTokenResponse>('users/user/current-user-info', {
    headers: {
      Authorization: accessToken,
    },
  });
};

export interface IRefreshTokensResponse {
  access: string;
}

export const refreshAccessToken = (refreshToken: string) => {
  return client.post<IRefreshTokensResponse, any /* { refresh: string } */>(
    'users/auth/token/refresh',
    {
      refresh: refreshToken,
    }
  );
};
