import client from '../client.service';

export interface IRetrieveTokensResponse {
  access: string | null;
  refresh: string | null;
}

export const retrieveTokens = (data: {
  username: string;
  password: string;
}) => {
  return client.post<IRetrieveTokensResponse>('/users/auth/token/obtain', {
    ...data,
  });
};

export interface IUser {
  username: string;
  email: string;
  id: number;
}

export interface ICreateUserResponse extends IRetrieveTokensResponse {
  user: IUser;
}

export const createUser = (data: {
  username: string;
  password: string;
  email: string;
  machine_id: string;
}) => {
  return client.post<ICreateUserResponse>('/users/user', {
    ...data,
  });
};

export interface IGetUserFromTokenResponse extends IUser {}

export const getUserFromToken = (accessToken: string) => {
  return client.get<IGetUserFromTokenResponse>('users/user/current-user-info', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export interface IRefreshAccessResponse {
  access: string;
}

export const refreshAccessToken = (refreshToken: string) => {
  return client.post<IRefreshAccessResponse>('users/auth/token/refresh', {
    refresh: refreshToken,
  });
};

export const requestCode = (email: string) => {
  return client.post<void>('users/request-password-reset', {
    email,
  });
};

export const requestPasswordReset = (
  email: string,
  code: string,
  newPassword: string
) => {
  return client.post<void>('users/reset-password', {
    email,
    resetCode: code,
    newPassword,
  });
};
