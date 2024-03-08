import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { GameSpotPlatform } from './gamespot-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(GameSpotPlatform);

	platform.execute();
});
