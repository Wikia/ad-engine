import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { SportsPlatform } from './sports-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(SportsPlatform);

	platform.execute();
});
