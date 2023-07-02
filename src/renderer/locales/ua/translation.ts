import { Resource } from 'i18next';
import { errors } from './errors';
import globalTranslation from '../global';

const translation: Resource = {
  translation: {
    ...globalTranslation,
    ...errors,
    LOGIN: 'Вхід',
    LOGIN_FIELD: "Ім'я користувача",
    LOGOUT: 'Вийти',
    PASSWORD: 'Пароль',
    EMAIL: 'Пошта',
    SAVE_PASSWORD: 'Зберегти пароль',
    FORGOT_PASSWORD: 'Забули пароль?',
    LOGIN_BUTTON: 'Увійти',
    DONT_HAVE_ACCOUNT: 'Не маєте акаунту?',
    REGISTER: 'Зареєструватися',
    ONLINE: 'Онлайн: ',
    START_GAME: 'Почати гру',
    WELCOME: 'Вітаємо, <br /> {{username}}',
    DEBUG_MODE: 'Налагодження',
    DEBUG_MODE_DESCRIPTION: 'Увімкнути режим налагодження для запуску клієнта.',
    AUTO_JOIN_SERVER: 'Автоматичний вхід',
    AUTO_JOIN_SERVER_DESCRIPTION:
      'Увімкнути автоматичний вхід на сервер при запуску клієнта.',
    FULLSCREEN_MODE: 'Повноекранний режим',
    FULLSCREEN_MODE_DESCRIPTION: 'Увімкнути повноекранний режим у грі.',
    CHANGE_PATH: 'Змінити',
    SAVE_CHANGES: 'Зберегти',
    INVALID_LOGIN: "Неправильне ім'я користувача",
    INVALID_PASSWORD: 'Неправильний пароль',
    INVALID_EMAIL: 'Неправильна пошта',
    REGISTRATION: 'Реєстрація',
    CONFIRM_AGREEMENT: 'Я погоджуюсь з <wrapper>правилами</wrapper> проєкту',
    HAVE_ACCOUNT: 'Маєте аккаунт?',
    TO_LOGIN: 'Увійти',
    YES: 'Так',
    NO: 'Ні',
    UNSAVED_SETTINGS_CONFIRMATION_TITLE:
      'Ви впевнені, що хочете вийти з цього вікна?',
    UNSAVED_SETTINGS_CONFIRMATION_DESCRIPTION:
      'Ви внесли зміни в налаштуваннях, але не зберегли їх',
    CURRENT_SELECTED_SERVER: 'Обраний сервер',
  },
};

export default translation;
