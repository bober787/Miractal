import { test as setup, expect } from '@playwright/test';
import { StorageStatePath } from '../data/constants';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { generateUser } from '../utils/generateUser';

// Регистрируем одного тестового пользователя один раз перед прогоном проекта "authenticated"
// и сохраняем storageState.json. Оформлено как setup-проект (а не globalSetup из конфига),
// поэтому не выполняется для проекта "guest" (тест-кейсы 1 и 4, включая регистрацию) —
// они идут с чистым storageState и не зависят от shared-пользователя.
setup('register shared test user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    const homePage = new HomePage(page);
    const user = generateUser();

    await registerPage.open();
    await registerPage.register(user);

    await expect(page).toHaveURL(registerPage.buildUrl('/'));
    await expect(homePage.userMenuLink).toBeVisible();

    await page.context().storageState({ path: StorageStatePath });
    console.log(`Storage state saved to ${StorageStatePath} for user ${user.username}`);
});
