import { test, expect } from '../../fixtures/pages.fixture';
import { ApiRoutes, MockedTags } from '../../data/constants';

// Тест-кейс 3: Мокирование данных (изоляция UI от бэкенда)
test.describe('Мокирование Popular Tags', () => {
    test('в блоке Popular Tags отображаются замоканные теги', async ({ page, homePage }) => {
        // 1. Перехват GET /api/tags
        await page.route(ApiRoutes.TAGS, async (route) => {
            // 2. Подмена ответа сервера кастомным списком тегов.
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: { 'access-control-allow-origin': 'https://demo.realworld.show' },
                body: JSON.stringify({ tags: MockedTags }),
            });
        });

        // 3. Открыть главную страницу
        await homePage.open();

        // Проверить, что в Popular Tags отображаются именно замоканные теги, а не реальные данные с сервера.
        await expect(homePage.popularTagItems).toHaveText(MockedTags);
    });
});
