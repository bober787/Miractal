# Miractal — Playwright + TypeScript автотесты

Автотесты [RealWorld](https://demo.realworld.show) на TypeScript + Playwright, Page Object + Jenkins + Docker + Tg отчёт

## Фичи

- **4 тест-кейса**: регистрация/логин/логаут, создание публикации с валидацией API, мок `GET /api/tags`, валидация формы логина.
- **Page Object + фикстуры** — `pages/`, внедрение через `fixtures/pages.fixture.ts`.
- **Shared-авторизация** — `tests/global.setup.ts` (Playwright setup-проект) регистрирует пользователя один раз, `storageState.json` переиспользуется в тестах проекта `authenticated`.
- **Скриншот + trace при падении** — `screenshot: 'only-on-failure'`, `trace: 'retain-on-failure'` в `playwright.config.ts`.
- **Docker** — `Dockerfile`/`docker-compose.yml` для разового прогона тестов и просмотра HTML-отчёта.
- **Jenkins в Docker** — `Dockerfile.jenkins`: Jenkins + Node + Playwright в одном постоянно работающем контейнере, job настраивается вручную через UI.
- **Telegram-уведомления** — `reporters/telegramReporter.ts` шлёт старт/итоги прогона в чат.

## Быстрый старт (локально)

```bash
npm install
npm run install:browsers
npm test
```

Переменные окружения — см. `.env.example`:

| Переменная           | Описание                                              |
|-----------------------|--------------------------------------------------------|
| `BASE_URL`            | URL тестируемого приложения (по умолчанию demo-стенд)  |
| `PLAYWRIGHT_WORKERS`  | Количество воркеров                                    |
| `TELEGRAM_BOT_TOKEN`  | Токен бота    |
| `TELEGRAM_CHAT_ID`    | ID чата для уведомлений                                |

## Docker

```bash
docker compose build
docker compose up miractal-tests      # прогон тестов, отчёт → ./playwright-report
docker compose up miractal-report     # просмотр отчёта на http://localhost:51876
```

## Jenkins

```bash
docker compose up -d jenkins          # поднимается постоянно
```

Мастер первого запуска пропущен, пользователь `admin/admin` создаётся автоматически
(`Jenkins/init-security.groovy`) — сразу логин и создание job'а, без разблокировки паролем.

Node/Playwright/плагины (`git`, `workflow-aggregator`, `htmlpublisher`, `dark-theme`) уже в образе. Pipeline-job:
`Script Path: Jenkins/Jenkinsfile` (Pipeline script from SCM). После прогона: HTML-отчёт публикуется
(`publishHTML`), `playwright-report/` и `test-results/` (скриншоты, trace при падении) архивируются как
артефакты сборки, в Telegram уходит уведомление с итогами прогона.

### Где смотреть отчёт Playwright после прогона в Jenkins

- В сборке (`Build #N`) слева в меню появляется пункт **Playwright Report** — открывает HTML-отчёт
  прямо в Jenkins (пункт добавляется `publishHTML`).
- Также отчёт лежит в артефактах сборки: **Build #N → Artifacts → `playwright-report/index.html`**.
- Скриншоты и trace упавших тестов — там же, в артефактах, `test-results/**` (или сразу во вкладках
  Screenshots/Trace прямо внутри HTML-отчёта, trace открывается встроенным trace-viewer).

### Пример уведомлений в Telegram

Старт прогона:
```
🚀 Прогон тестов запущен!

🧪 Количество тестов: 7
👷 Воркеры: 4
```

Завершение прогона:
```
📦 Прогон завершен

🧪 Всего: 7/100%
✅ Успешно: 7/100%
❌ Провалено: 0/0%
➖ Пропущено: 0/0%

⏱️ Длительность: 0 мин 17 сек
```

## Доступы

| Что                | Значение                         |
|--------------------|----------------------------------|
| Jenkins            | http://localhost:8080            |
| Jenkins логин      | `admin` / `admin`                |
| Отчёт  | В артифифактах сборки index.html |
| Telegram-группа с уведомлениями о прогонах | https://t.me/+NWt2uuJ3j1k1MWMy   |

## Структура

```
data/           # константы: URL, роуты, тестовые данные
fixtures/       # Playwright-фикстуры
pages/          # Page Objects
utils/          # генерация тестовых данных (faker)
reporters/      # Telegram-репортер
tests/
  global.setup.ts   # регистрация shared-пользователя
  Auth/             # тест-кейсы 1, 4
  Articles/         # тест-кейсы 2, 3
Jenkins/        # Jenkinsfile + plugins.txt
```
