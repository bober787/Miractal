import { Page, Response } from '@playwright/test';
import { BasePage } from './BasePage';
import { Routes } from '../data/constants';

export class EditorPage extends BasePage {
    readonly titleInput = this.page.getByPlaceholder('Article Title');
    readonly descriptionInput = this.page.getByPlaceholder("What's this article about?");
    readonly bodyInput = this.page.getByPlaceholder('Write your article (in markdown)');
    readonly tagsInput = this.page.getByPlaceholder('Enter tags');
    readonly submitButton = this.page.getByRole('button', { name: /publish article/i });
    readonly errorList = this.page.locator('.error-messages');
    readonly errorItems = this.errorList.locator('li');

    constructor(page: Page) {
        super(page);
    }

    async open(): Promise<void> {
        await this.goto(Routes.EDITOR);
    }

    async fillForm(title: string, description: string, body: string, tags: string[] = []): Promise<void> {
        await this.titleInput.fill(title);
        await this.descriptionInput.fill(description);
        await this.bodyInput.fill(body);

        for (const tag of tags) {
            await this.tagsInput.fill(tag);
            await this.tagsInput.press('Enter');
        }
    }

    async submit(): Promise<void> {
        await this.submitButton.click();
    }

    async publish(): Promise<Response> {
        const [response] = await Promise.all([
            this.page.waitForResponse((res) => res.url().endsWith('/api/articles') && res.request().method() === 'POST'),
            this.submit(),
        ]);

        return response;
    }
}
