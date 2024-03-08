import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { TvGuidePlatform } from './tvguide-platform';

withSentry((container: Container) => {
	const platform = container.get(TvGuidePlatform);

	platform.execute(container);
});
