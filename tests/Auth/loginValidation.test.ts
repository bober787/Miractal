import { test, expect } from '../../fixtures/pages.fixture';

// Тест-кейс 4: Обработка ошибок валидации формы логина (UI + API)
test.describe('Валидация формы логина', () => {
    test('ошибка при неверных данных для входа', async ({ loginPage }) => {
        // 1. Переход на страницу логина
        await loginPage.open();

        // 2. Ввод неверных данных
        await loginPage.login('nonexistent-user@miractal-test.com', 'wrong-password');

        // Проверка блока ошибки валидации на UI
        await expect(loginPage.errorList).toBeVisible();
        await expect(loginPage.errorItems).toHaveText(['credentials invalid']);
    });
});
