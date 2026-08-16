import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { HomePage } from '../pages/HomePage';
import { SettingsPage } from '../pages/SettingsPage';
import { EditorPage } from '../pages/EditorPage';
import { ArticlePage } from '../pages/ArticlePage';

type Pages = {
    loginPage: LoginPage;
    registerPage: RegisterPage;
    homePage: HomePage;
    settingsPage: SettingsPage;
    editorPage: EditorPage;
    articlePage: ArticlePage;
};

export const test = base.extend<Pages>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    settingsPage: async ({ page }, use) => {
        await use(new SettingsPage(page));
    },
    editorPage: async ({ page }, use) => {
        await use(new EditorPage(page));
    },
    articlePage: async ({ page }, use) => {
        await use(new ArticlePage(page));
    },
});

export { expect } from '@playwright/test';
