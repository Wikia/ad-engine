import { Container } from '@wikia/dependency-injection';
import { SportsPlatform } from './sports-platform';
import './styles.scss';

type Application = 'futhead' | 'muthead';

async function start(): Promise<void> {
	const container = new Container();
	const app: Application = window.location.host.includes('futhead') ? 'futhead' : 'muthead';
	const platform = container.get(SportsPlatform);

	platform.execute(app);
}

start();
