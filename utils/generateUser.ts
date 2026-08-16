import { faker } from '@faker-js/faker';

export type TestUser = {
    username: string;
    email: string;
    password: string;
};

// Уникальный пользователь на каждый вызов — важно для параллельных воркеров (fullyParallel),
// Чтобы тесты регистрации не конфликтовали друг с другом за один и тот же username/email.
export function generateUser(): TestUser {
    const unique = faker.string.alphanumeric(8).toLowerCase();

    return {
        username: `qa_${unique}`,
        email: `qa_${unique}@miractal-test.com`,
        password: faker.internet.password({ length: 12 }),
    };
}
