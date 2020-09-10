import { Container } from '@wikia/dependency-injection';
import { GamepediaPlatform } from './gamepedia-platform';
import './styles.scss';
import { mediaWikiWrapper } from './utils/media-wiki-wrapper';

const load = async () => {
	const container = new Container();
	const platform = container.get(GamepediaPlatform);

	platform.execute();
};

mediaWikiWrapper.ready.then(load);
