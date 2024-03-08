import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { ComicvinePlatform } from './comicvine-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(ComicvinePlatform);

	platform.execute();
});
