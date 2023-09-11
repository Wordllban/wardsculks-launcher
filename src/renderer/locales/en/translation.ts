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
    LOGIN_BUTTON: 'Join',
    DONT_HAVE_ACCOUNT: 'Do not have an account?',
    REGISTER: 'Sign up',
    ONLINE: 'Online: ',
    START_GAME: 'Start',
    WELCOME: 'Welcome, <br /> {{username}}',
    DEBUG_MODE: 'Debug',
    DEBUG_MODE_DESCRIPTION: 'Enable debug mode for client startup.',
    AUTO_JOIN_SERVER: 'Auto Join',
    AUTO_JOIN_SERVER_DESCRIPTION: 'Automatically join the server on startup.',
    FULLSCREEN_MODE: 'Fullscreen Mode',
    FULLSCREEN_MODE_DESCRIPTION: 'Enable the fullscreen mode.',
    CHANGE_PATH: 'Change',
    SAVE_CHANGES: 'Save',
    INVALID_LOGIN: 'Invalid username',
    INVALID_PASSWORD: 'Invalid password',
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
  },
};

export default translation;
