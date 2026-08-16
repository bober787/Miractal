import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../data/constants';
import { TestUser } from '../utils/generateUser';

export class RegisterPage extends BasePage {
    readonly usernameInput = this.page.getByPlaceholder('Username');
    readonly emailInput = this.page.getByPlaceholder('Email');
    readonly passwordInput = this.page.getByPlaceholder('Password');
    readonly submitButton = this.page.getByRole('button', { name: /sign up/i });
    readonly errorList = this.page.locator('.error-messages');

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto(Routes.REGISTER);
    }

    async fillForm(username: string, email: string, password: string): Promise<void> {
        await this.usernameInput.fill(username);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    // onSubmitting запускается параллельно с отправкой формы, пока запрос ещё в полёте —
    // это позволяет тестам навешивать свои проверки (например, что кнопка disabled) поверх метода,
    // не встраивая их в саму страницу.
    async register(user: TestUser, onSubmitting?: () => Promise<void>): Promise<void> {
        await this.fillForm(user.username, user.email, user.password);

        const submitted = this.submit();
        await onSubmitting?.();
        await submitted;
    }
}
