const errors: Record<string, string> = {
  SHOW_NATIVE_ERROR: 'Показати нативну помилку',
  HIDE_NATIVE_ERROR: 'Сховати нативну помилку',
  FAILED_TO_LOGIN: 'Не вдалось увійти',
  FAILED_TO_REGISTER: 'Не вдалось зареєструватись',
  FAILED_TO_REQUEST_RESET_CODE: 'Не вдалось запросити код підтвердження',
  FAILED_TO_REQUEST_PASSWORD_CHANGE: 'Не вдалось змінити пароль',
  FAILED_TO_GET_SETTINGS: 'Не вдалось отримати поточні налаштування',
  FAILED_TO_GET_SYSTEM_MEMORY: "Не вдалось отримати об'єм ОЗУ системи",
  FAILED_TO_GET_SERVERS_LIST: 'Не вдалось отримати список доступних серверів',
  SESSION_EXPIRED_PLEASE_RELOGIN:
    'Час сеансу вичерпаний. Будь ласка, увійдіть ще раз',
  ERROR_DURING_INSTALLATION: 'Сталась помилка при завантаженні гри',
  GAME_FOLDER_NOT_FOUND: 'Тека гри не знайдена, починаємо встановлення',
  ERROR_DURING_FILE_VERIFICATION:
    'Сталась помилка при перевірці ігрових файлів, будь ласка, спробуйте ще раз',
  ERROR_DURING_APP_UPDATE:
    'Не вдалось оновити застосунок, будь ласка, перезапустіть застосунок',
  FAILED_TO_GET_SERVER_INFO: 'Не вдалось отримати інформацію про сервер',
  FAILED_TO_CREATE_DEBUG_FILE: 'Не вдалось створити файл налагодження',
  FAILED_TO_LAUNCH_GAME: 'Не вдалось запустити гру',
  FAILED_TO_GET_MODS_LIST: 'Не вдалось отримати список модів',
  FAILED_TO_SAVE_SELECTED_MODS: 'Не вдалось зберегти обране. Спробуйте ще раз',
  FAILED_TO_GENERATE_LAUNCH_COMMAND:
    'Не вдалось запустити гру. Неправильний рушій!',
};

export default errors;
