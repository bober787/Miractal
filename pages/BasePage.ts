import { Page } from '@playwright/test';
import { BaseUrl } from '../data/constants';

// Шапка (app-layout-header) общая для всех страниц приложения, поэтому её локаторы
// и признак авторизации вынесены в базовый класс, а не дублируются в каждом Page Object.
export class BasePage {
    readonly signInLink = this.page.getByRole('link', { name: 'Sign in' });
    readonly signUpLink = this.page.getByRole('link', { name: 'Sign up' });
    readonly settingsLink = this.page.getByRole('link', { name: /Settings/i });
    readonly newArticleLink = this.page.getByRole('link', { name: /New Article/i });
    readonly userMenuLink = this.page.locator('nav a[href^="/profile/"]');

    constructor(protected readonly page: Page) {}

    buildUrl(path: string): string {
        return `${BaseUrl.URL}${path}`;
    }

    async goto(path: string): Promise<void> {
        await this.page.goto(this.buildUrl(path));
    }

    async goToSettings(): Promise<void> {
        await this.settingsLink.click();
    }
}
