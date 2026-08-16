import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../data/constants';

export class SettingsPage extends BasePage {
    readonly logoutButton = this.page.getByRole('button', { name: /logout/i });

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto(Routes.SETTINGS);
    }

    async logout(): Promise<void> {
        await this.logoutButton.click();
    }
}
