export const BaseUrl = {
    URL: process.env.BASE_URL || 'https://demo.realworld.show',
};

export const Routes = {
    HOME: '/',
    REGISTER: '/register',
    LOGIN: '/login',
    EDITOR: '/editor',
    SETTINGS: '/settings',
    article: (slug: string) => `/article/${slug}`,
};

export const ApiRoutes = {
    ARTICLES: '**/api/articles',
    ARTICLES_CREATE: '**/api/articles',
    TAGS: '**/api/tags',
    USERS_LOGIN: '**/api/users/login',
    USERS_REGISTER: '**/api/users',
};

export const MockedTags = ['Bitcoin', 'Ethereum', 'Solana', 'USDT'];

export const StorageStatePath = 'storageState.json';

export const Telegram = {
    BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    CHAT_ID: process.env.TELEGRAM_CHAT_ID
};
