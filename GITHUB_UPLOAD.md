# Инструкция по загрузке в GitHub

## Что нужно загрузить в репозиторий

Для работы плагина в вашем GitHub репозитории [https://github.com/flahanc/CreateClanPlugin.git](https://github.com/flahanc/CreateClanPlugin.git) нужно загрузить следующие файлы:

### 1. Основные файлы плагина
- `CreateClanPlugin.plugin.js` - основной файл плагина
- `README.md` - документация проекта
- `clans-data.json` - файл для хранения данных о кланах (создается автоматически)

### 2. Дополнительные файлы
- `GITHUB_SETUP.md` - инструкция по настройке GitHub
- `GITHUB_UPLOAD.md` - эта инструкция

## Как загрузить файлы

### Способ 1: Через веб-интерфейс GitHub

1. Перейдите на [https://github.com/flahanc/CreateClanPlugin](https://github.com/flahanc/CreateClanPlugin)
2. Нажмите кнопку "Add file" → "Upload files"
3. Перетащите файлы или выберите их через проводник
4. Добавьте сообщение коммита: "Add CreateClanPlugin files"
5. Нажмите "Commit changes"

### Способ 2: Через Git командную строку

```bash
# Клонируйте репозиторий
git clone https://github.com/flahanc/CreateClanPlugin.git
cd CreateClanPlugin

# Скопируйте файлы в папку
# (скопируйте все файлы из вашей рабочей папки)

# Добавьте файлы в Git
git add .

# Создайте коммит
git commit -m "Add CreateClanPlugin files"

# Отправьте изменения на GitHub
git push origin main
```

### Способ 3: Через GitHub Desktop

1. Скачайте и установите [GitHub Desktop](https://desktop.github.com/)
2. Клонируйте репозиторий
3. Скопируйте файлы в папку репозитория
4. Создайте коммит и отправьте изменения

## Структура репозитория

После загрузки ваш репозиторий должен выглядеть так:

```
CreateClanPlugin/
├── CreateClanPlugin.plugin.js    # Основной плагин
├── README.md                     # Документация
├── clans-data.json              # Данные кланов (создается автоматически)
├── GITHUB_SETUP.md              # Инструкция по настройке
└── GITHUB_UPLOAD.md             # Эта инструкция
```

## Проверка загрузки

После загрузки файлов:

1. Перейдите на [https://github.com/flahanc/CreateClanPlugin](https://github.com/flahanc/CreateClanPlugin)
2. Убедитесь, что все файлы отображаются
3. Проверьте, что файл `CreateClanPlugin.plugin.js` содержит правильный код
4. Убедитесь, что README.md отображается корректно

## Настройка для пользователей

После загрузки файлов пользователи смогут установить плагин:

1. Через BetterDiscord: `https://raw.githubusercontent.com/flahanc/CreateClanPlugin/main/CreateClanPlugin.plugin.js`
2. Или скачать файл `CreateClanPlugin.plugin.js` и установить вручную

## Автоматическое обновление

Плагин настроен на автоматическое обновление через GitHub. При изменении файла `CreateClanPlugin.plugin.js` в репозитории, пользователи получат уведомление об обновлении.

## Безопасность

- Файл `clans-data.json` будет создан автоматически при первом использовании плагина
- GitHub токены пользователей хранятся локально в BetterDiscord
- Данные о кланах синхронизируются только с вашим репозиторием

## Поддержка

Если возникли проблемы с загрузкой:

1. Проверьте права доступа к репозиторию
2. Убедитесь, что репозиторий публичный
3. Проверьте, что ветка называется `main`
4. Создайте Issue в репозитории для получения помощи 