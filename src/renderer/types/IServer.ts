export interface IServer {
  id: number;
  title: string;
  name: string;
  immutableFolders: string[];
  ip: string;
  version: string;
}

export interface IServerInfo {
  online: boolean;
  host: string;
  players: {
    online: number;
    max: number;
    list: [];
  };
}
