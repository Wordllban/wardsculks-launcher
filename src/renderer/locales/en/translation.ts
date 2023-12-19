import { Resource } from 'i18next';
import errors from './errors';
import logs from './logs';
import globalTranslation from '../global';

const translation: Resource = {
  translation: {
    ...globalTranslation,
    ...errors,
    ...logs,
    LOGIN: 'Sign in',
    LOGIN_FIELD: 'Username',
    LOGOUT: 'Logout',
    PASSWORD: 'Password',
    EMAIL: 'Email',
    SAVE_PASSWORD: 'Save password',
    FORGOT_PASSWORD: 'Forgot password?',
    LOGIN_BUTTON: 'Login',
    DONT_HAVE_ACCOUNT: 'Do not have an account?',
    REGISTER: 'Sign up',
    REQUEST_RESET_PASSWORD: 'You will receive a confirmation code by email',
    REQUEST_CODE: 'Get code',
    REQUEST_CODE_AGAIN: 'Get code one more time: ',
    CHANGE_PASSWORD: 'Change password',
    CONFIRMATION_CODE: 'Confirmation code',
    INVALID_CONFIRMATION_CODE: 'Code must contain 6 symbols',
    PASSWORDS_NOT_EQUAL: 'Passwords are not equal',
    CONFIRMATION_CODE_REQUESTED_SUCCESSFULLY:
      'Confirmation code sent. Check your email',
    PASSWORD_CHANGED_SUCCESSFULLY: 'Password changed successfully',
    REDIRECT_AFTER_PASSWORD_CHANGE:
      'You will be redirected to login page in 3 seconds',
    NEW_PASSWORD: 'New password',
    REPEAT_NEW_PASSWORD: 'Repeat password',
    CHANGE_PASSWORD_BUTTON: 'Change',
    ONLINE: 'Online: ',
    START_GAME: 'Start',
    WELCOME: 'Welcome, <br /> {{username}}',
    DEBUG_MODE: 'Debug',
    DEBUG_MODE_DESCRIPTION:
      'A debug file will be created in the server folder on game launch',
    AUTO_JOIN_SERVER: 'Auto Join',
    AUTO_JOIN_SERVER_DESCRIPTION: 'Automatically join the server on startup',
    FULLSCREEN_MODE: 'Fullscreen Mode',
    FULLSCREEN_MODE_DESCRIPTION: 'Enable the fullscreen mode',
    CLOSE_LAUNCHER_ON_GAME_START: 'Close app on game start',
    CLOSE_LAUNCHER_ON_GAME_START_DESCRIPTION: 'Does not work in debug mode',
    CHANGE_PATH: 'Change',
    SAVE_CHANGES: 'Save',
    INVALID_LOGIN: 'Invalid username',
    INVALID_PASSWORD: 'Invalid password',
    WEAK_PASSWORD:
      'Your password must be at least 6 characters long and contain at least 1 number and 1 capital letter. qwe or 123 is too simple',
    INVALID_EMAIL: 'Invalid email',
    REGISTRATION: 'Registration',
    CONFIRM_AGREEMENT: 'I agree with <wrapper>terms</wrapper> of use',
    HAVE_ACCOUNT: 'Already have an account?',
    TO_LOGIN: 'Login',
    YES: 'Yes',
    NO: 'No',
    UNSAVED_SETTINGS_CONFIRMATION_TITLE:
      'Are you sure you want to leave this window?',
    UNSAVED_SETTINGS_CONFIRMATION_DESCRIPTION:
      "You have changed settings, but haven't saved them.",
    CURRENT_SELECTED_SERVER: 'Selected server',
    MODS_PAGE: 'Mods',
    ALL: 'All',
    SELECTED: 'Selected',
    UNSELECTED: 'Unselected',
    TEXTURE_PACKS: 'Texture packs',
    SHADERS: 'Shaders',
    SHOW_MORE: 'Show more',
    HIDE: 'Hide',
    SEARCH_PLACEHOLDER: 'Search...',
    MODS_SEARCH_NO_RESULTS: 'No mods found',
    MODS_SEARCH_NO_RESULTS_SUGGESTION:
      'However, you can suggest your mod in our Discord server!',
    JOIN: 'Join',
  },
};

export default translation;
