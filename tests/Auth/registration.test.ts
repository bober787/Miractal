import { test, expect } from '../../fixtures/pages.fixture';
import { generateUser } from '../../utils/generateUser';
import { Routes } from '../../data/constants';

// Тест-кейс 1: Регистрация пользователя
test.describe('Регистрация пользователя', () => {
    test('регистрация нового пользователя, logout и повторный login', async ({
        page,
        registerPage,
        loginPage,
        homePage,
        settingsPage,
    }) => {
        const user = generateUser();

        // 1-2. Переход на /register, заполнение формы регистрации и отправка.
        await registerPage.open();
        await registerPage.register(user, async () => {
            await expect(registerPage.submitButton).toBeDisabled();
        });

        // 4. Проверить, что произошла регистрация: переход на главную страницу + признак, что юзер залогинен
        await expect(page).toHaveURL(registerPage.buildUrl(Routes.HOME));
        await expect(homePage.userMenuLink).toBeVisible();

        // 5. Запомнить пользователя — используем сгенерированные username/email/password для logout/login ниже
        // 6. logout: переход в Settings и клик по кнопке логаута
        await homePage.goToSettings();
        await expect(page).toHaveURL(settingsPage.buildUrl(Routes.SETTINGS));
        await settingsPage.logout();
        await expect(settingsPage.userMenuLink).toBeHidden();

        // 7. login тем же пользователем
        await loginPage.open();
        await loginPage.login(user.email, user.password);
        await expect(page).toHaveURL(loginPage.buildUrl(Routes.HOME));
        await expect(homePage.userMenuLink).toBeVisible();
    });
});
