import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ArticlePage extends BasePage {
    readonly title = this.page.locator('.article-page h1');
    readonly body = this.page.locator('.article-content p');
    readonly tagList = this.page.locator('.tag-list .tag-pill');

    constructor(page: Page) {
        super(page);
    }
}
