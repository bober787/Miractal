import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    workers: process.env.PLAYWRIGHT_WORKERS ? parseInt(process.env.PLAYWRIGHT_WORKERS, 10) : 4,
    timeout: 60000,
    retries: process.env.CI ? 1 : 0,

    reporter: [
        ['html', { open: 'never' }],
        ['list'],
        ['./reporters/telegramReporter.ts'],
    ],

    use: {
        baseURL: process.env.BASE_URL || 'https://demo.realworld.show',
        headless: true,
        viewport: { width: 1920, height: 1080 },
        video: 'off',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },

    projects: [
        {
            // Регистрирует shared-пользователя и сохраняет storageState.json.
            // В зависимостях указан только у проекта "authenticated" — на "guest" не влияет.
            name: 'setup',
            testMatch: /tests[\\/]global\.setup\.ts/,
        },
        {
            // Тест-кейсы 1 и 4: пользователь не должен быть авторизован
            name: 'guest',
            testMatch: /tests[\\/]Auth[\\/].*\.test\.ts/,
            use: { storageState: { cookies: [], origins: [] } },
        },
        {
            // Тест-кейсы 2 и 3: пользователь уже авторизован через shared storageState
            name: 'authenticated',
            testMatch: /tests[\\/]Articles[\\/].*\.test\.ts/,
            dependencies: ['setup'],
            use: { storageState: 'storageState.json' },
        },
    ],
});
