import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { BingeBotPlatform } from './bingebot-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(BingeBotPlatform);

	platform.execute();
});
