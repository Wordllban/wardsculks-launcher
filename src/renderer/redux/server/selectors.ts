import { AppState } from '../store';

export const getServerOnline = (state: AppState) =>
  state.server.serverInfo.players.online;
