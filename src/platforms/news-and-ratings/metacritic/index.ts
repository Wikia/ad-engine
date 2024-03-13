import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { MetacriticPlatform } from './metacritic-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(MetacriticPlatform);

	platform.execute();
});
