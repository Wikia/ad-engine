import { Container } from '@wikia/dependency-injection';
import { MutheadPlatform } from './muthead-platform';
import './styles.scss';

async function start(): Promise<void> {
	const container = new Container();
	const platform = container.get(MutheadPlatform);

	platform.execute();
}

start();
