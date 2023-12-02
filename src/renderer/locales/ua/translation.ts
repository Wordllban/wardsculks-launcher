import { Resource } from 'i18next';
import errors from './errors';
import logs from './logs';
import globalTranslation from '../global';

const translation: Resource = {
  translation: {
    ...globalTranslation,
    ...errors,
    ...logs,
    LOGIN: 'Вхід',
    LOGIN_FIELD: "Ім'я користувача",
    LOGOUT: 'Вийти',
    PASSWORD: 'Пароль',
    EMAIL: 'Пошта',
    SAVE_PASSWORD: 'Зберегти пароль',
    LOGIN_BUTTON: 'Увійти',
    DONT_HAVE_ACCOUNT: 'Не маєте акаунту?',
    REGISTER: 'Зареєструватися',
    FORGOT_PASSWORD: 'Забули пароль?',
    REQUEST_RESET_PASSWORD:
      'Ви отримаєте код для підтвердження на електронну скриню',
    REQUEST_CODE: 'Отримати код',
    REQUEST_CODE_AGAIN: 'Отримати код ще раз: ',
    CHANGE_PASSWORD: 'Зміна паролю',
    CONFIRMATION_CODE: 'Код підтвердження',
    INVALID_CONFIRMATION_CODE: 'Код має містити 6 символів',
    PASSWORDS_NOT_EQUAL: 'Паролі не є однаковими',
    CONFIRMATION_CODE_REQUESTED_SUCCESSFULLY:
      'Код для підтвердження надісланий. Перевірте електронну скриню',
    PASSWORD_CHANGED_SUCCESSFULLY: 'Пароль змінено',
    REDIRECT_AFTER_PASSWORD_CHANGE:
      'Ви будете перенаправлені на сторінку входу через 3 секунди',
    NEW_PASSWORD: 'Новий пароль',
    REPEAT_NEW_PASSWORD: 'Повторити пароль',
    CHANGE_PASSWORD_BUTTON: 'Змінити',
    ONLINE: 'Онлайн: ',
    START_GAME: 'Почати гру',
    WELCOME: 'Вітаємо, <br /> {{username}}',
    DEBUG_MODE: 'Налагодження',
    DEBUG_MODE_DESCRIPTION:
      'Під час запуску гри буде створений файл налагодження у папці серверу',
    AUTO_JOIN_SERVER: 'Автоматичний вхід',
    AUTO_JOIN_SERVER_DESCRIPTION:
      'Увімкнути автоматичний вхід на сервер при запуску клієнта',
    FULLSCREEN_MODE: 'Повноекранний режим',
    FULLSCREEN_MODE_DESCRIPTION: 'Увімкнути повноекранний режим у грі',
    CLOSE_LAUNCHER_ON_GAME_START: 'Закрити застосунок при запуску гри',
    CLOSE_LAUNCHER_ON_GAME_START_DESCRIPTION: 'Не працює у режимі налагодження',
    CHANGE_PATH: 'Змінити',
    SAVE_CHANGES: 'Зберегти',
    INVALID_LOGIN: "Неправильне ім'я користувача",
    INVALID_PASSWORD: 'Неправильний пароль',
    WEAK_PASSWORD:
      'Ваш пароль повинен містити від 6 символів, мати хоча б 1 цифру та 1 велику літеру. qwe чи 123 - надто просто',
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
