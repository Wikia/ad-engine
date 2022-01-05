import { Container } from '@wikia/dependency-injection';
import { SportsPlatform } from './sports-platform';
import './styles.scss';

async function start(): Promise<void> {
	const container = new Container();
	const platform = container.get(SportsPlatform);

	platform.execute();
}

start();
