import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../data/constants';

export class HomePage extends BasePage {
    readonly popularTagsBlock = this.page.locator('.sidebar .tag-list');
    readonly popularTagItems = this.popularTagsBlock.locator('a.tag-pill');

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto(Routes.HOME);
    }
}
