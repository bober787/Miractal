import { test, expect } from '../../fixtures/pages.fixture';
import { Routes } from '../../data/constants';

// Тест-кейс 2: Создание публикации с валидацией API
test.describe('Создание публикации', () => {
    test('отправка незаполненной формы показывает ошибки валидации', async ({ editorPage }) => {
        await editorPage.open();
        await editorPage.submit();

        await expect(editorPage.errorList).toBeVisible();
        await expect(editorPage.errorItems).toHaveText([
            "title can't be blank",
            "description can't be blank",
            "body can't be blank",
        ]);
    });

    test('отправка частично заполненной формы показывает ошибки валидации', async ({ editorPage }) => {
        await editorPage.open();
        await editorPage.titleInput.fill('Только заголовок');
        await editorPage.submit();

        await expect(editorPage.errorItems).toHaveText([
            "description can't be blank",
            "body can't be blank",
        ]);
    });

    test('успешное создание публикации с валидацией сетевого запроса', async ({ page, editorPage, articlePage }) => {
        const article = {
            title: `Test article ${Date.now()}`,
            description: 'QA automation test description',
            body: 'QA automation test body',
            tags: ['qa', 'automation'],
        };

        await editorPage.open();
        await editorPage.fillForm(article.title, article.description, article.body, article.tags);

        // Перехват сетевого запроса POST /api/articles и валидация тела ответа
        const response = await editorPage.publish();

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.article.title).toBe(article.title);
        expect(body.article.description).toBe(article.description);
        expect(body.article.body).toBe(article.body);
        expect([...body.article.tagList].sort()).toEqual([...article.tags].sort());
        expect(body.article.slug).toBeTruthy();

        // Проверка редиректа на страницу созданной записи и корректных данных в UI
        await expect(page).toHaveURL(editorPage.buildUrl(Routes.article(body.article.slug)));
        await expect(articlePage.title).toHaveText(article.title);
        await expect(articlePage.body).toHaveText(article.body);

        const tagTexts = (await articlePage.tagList.allTextContents()).map((tag) => tag.trim());
        expect(tagTexts.sort()).toEqual([...body.article.tagList].sort());
    });
});
