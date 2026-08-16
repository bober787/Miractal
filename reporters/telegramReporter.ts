import type { FullConfig, Reporter, Suite } from '@playwright/test/reporter';
import { Telegram } from '../data/constants';

// Отправляет сообщение о старте и итогах прогона в Telegram.
export default class TelegramReporter implements Reporter {
    private suite: Suite | undefined;
    private startedAt = 0;

    async onBegin(config: FullConfig, suite: Suite): Promise<void> {
        this.suite = suite;
        this.startedAt = Date.now();

        const total = suite.allTests().length;

        await this.send(`🚀 Прогон тестов запущен!\n\n🧪 Количество тестов: ${total}\n👷 Воркеры: ${config.workers}`);
    }

    async onEnd(): Promise<void> {
        const tests = this.suite?.allTests() ?? [];
        const total = tests.length;

        const passed = tests.filter((t) => t.outcome() === 'expected' || t.outcome() === 'flaky').length;
        const failed = tests.filter((t) => t.outcome() === 'unexpected').length;
        const skipped = tests.filter((t) => t.outcome() === 'skipped').length;

        const percent = (count: number) => (total === 0 ? 0 : Math.round((count / total) * 100));

        const durationSeconds = Math.round((Date.now() - this.startedAt) / 1000);
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = durationSeconds % 60;

        const text = [
            '📦 Прогон завершен',
            '',
            `🧪 Всего: ${total}/100%`,
            `✅ Успешно: ${passed}/${percent(passed)}%`,
            `❌ Провалено: ${failed}/${percent(failed)}%`,
            `➖ Пропущено: ${skipped}/${percent(skipped)}%`,
            '',
            `⏱️ Длительность: ${minutes} мин ${seconds} сек`,
        ].join('\n');

        await this.send(text);
    }

    private async send(text: string): Promise<void> {
        if (!Telegram.BOT_TOKEN || !Telegram.CHAT_ID) {
            return;
        }

        const body: Record<string, unknown> = { chat_id: Telegram.CHAT_ID, text };

        try {
            const response = await fetch(`https://api.telegram.org/bot${Telegram.BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                console.error(`Telegram notification failed: ${response.status} ${await response.text()}`);
            }
        } catch (error) {
            console.error('Telegram notification failed:', error);
        }
    }
}
