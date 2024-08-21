const errors: Record<string, string> = {
  SHOW_NATIVE_ERROR: 'Show native error',
  HIDE_NATIVE_ERROR: 'Hide native error',
  FAILED_TO_LOGIN: 'Failed to login',
  FAILED_TO_REGISTER: 'Failed to register',
  FAILED_TO_REQUEST_RESET_CODE: 'Failed to request confirmation code',
  FAILED_TO_REQUEST_PASSWORD_CHANGE: 'Failed to request password change',
  FAILED_TO_GET_SETTINGS: 'Failed to get settings',
  FAILED_TO_GET_SYSTEM_MEMORY: 'Failed to get system memory size',
  FAILED_TO_GET_SERVERS_LIST: 'Failed to retrieve list of available servers',
  SESSION_EXPIRED_PLEASE_RELOGIN: 'Session expired. Please, login again',
  ERROR_DURING_INSTALLATION: 'Error during installation',
  GAME_FOLDER_NOT_FOUND: 'Game folder not found, starting installation',
  ERROR_DURING_FILE_VERIFICATION:
    'Error during file verification, please try again',
  ERROR_DURING_APP_UPDATE: 'Error during app update, please make app re-start',
  FAILED_TO_GET_SERVER_INFO: 'Failed to retrieve server information',
  FAILED_TO_CREATE_DEBUG_FILE: 'Failed to create debug file',
  FAILED_TO_LAUNCH_GAME: 'Failed to launch game',
  FAILED_TO_GET_MODS_LIST: 'Failed to request mods list',
  FAILED_TO_SAVE_SELECTED_MODS: 'Failed to save selected. Please, try again',
  FAILED_TO_GENERATE_LAUNCH_COMMAND: 'Failed to launch game. Wrong engine!',
  FAILED_TO_UPDATE_OPTIONS_TXT_DONT_EXIST:
    'Failed to update game settings. Launch the game and try again',
  FAILED_TO_SAVE_SETTINGS_CHANGES: "Failed to save settings' changes",
};

export default errors;
