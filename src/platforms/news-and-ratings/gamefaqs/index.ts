import { withSentry } from '@platforms/shared';
import { Container } from '@wikia/dependency-injection';
import { GamefaqsPlatform } from './gamefaqs-platform';
import './styles.scss';

withSentry((container: Container) => {
	const platform = container.get(GamefaqsPlatform);

	platform.execute();
});
