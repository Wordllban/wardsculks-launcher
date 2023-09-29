const errors: Record<string, string> = {
  SHOW_NATIVE_ERROR: 'Показати нативну помилку',
  HIDE_NATIVE_ERROR: 'Сховати нативну помилку',
  FAILED_TO_LOGIN: 'Не вдалось увійти',
  FAILED_TO_REGISTER: 'Не вдалось зареєструватись',
  FAILED_TO_GET_SETTINGS: 'Не вдалось отримати поточні налаштування',
  FAILED_TO_GET_SYSTEM_MEMORY: "Не вдалось отримати об'єм ОЗУ системи",

  FAILED_TO_GET_SERVERS_LIST: 'Не вдалось отримати список доступних серверів',
  SESSION_EXPIRED_PLEASE_RELOGIN:
    'Час сеансу вичерпаний. Будь ласка, увійдіть ще раз',
  ERROR_DURING_INSTALLATION: 'Сталась помилка при завантаженні гри',
  GAME_FOLDER_NOT_FOUND: 'Тека гри не знайдена, починаємо встановлення',
  ERROR_DURING_FILE_VERIFICATION:
    'Сталась помилка при перевірці ігрових файлів, будь ласка, спробуйте ще раз',
};

export default errors;
