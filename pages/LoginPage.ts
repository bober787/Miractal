import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../data/constants';

export class LoginPage extends BasePage {
    readonly emailInput = this.page.getByPlaceholder('Email');
    readonly passwordInput = this.page.getByPlaceholder('Password');
    readonly submitButton = this.page.getByRole('button', { name: /sign in/i });
    readonly errorList = this.page.locator('.error-messages');
    readonly errorItems = this.errorList.locator('li');

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto(Routes.LOGIN);
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
