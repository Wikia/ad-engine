import { Container } from '@wikia/dependency-injection';
import { BingeBotPlatform } from './bingebot-platform';

window.RLQ = window.RLQ || [];
window.RLQ.push(async () => {
	const container = new Container();
	const platform = container.get(BingeBotPlatform);

	platform.execute();
});
