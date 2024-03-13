import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { GiantbombPlatform } from './giantbomb-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(GiantbombPlatform);

	platform.execute();
});
