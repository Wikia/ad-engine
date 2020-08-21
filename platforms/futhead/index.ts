import { Container } from '@wikia/dependency-injection';
import { FutheadPlatform } from './futhead-platform';
import './styles.scss';

async function start(): Promise<void> {
	const container = new Container();
	const platform = container.get(FutheadPlatform);

	platform.execute();
}

start();
