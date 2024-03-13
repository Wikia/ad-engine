import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { TvGuideMTCPlatform } from './tvguide-mtc-platform';

withSentry((container: Container) => {
	const platform = container.get(TvGuideMTCPlatform);

	platform.execute();
});
