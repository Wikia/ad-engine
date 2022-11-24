import { Container } from '@wikia/dependency-injection';
import { FanCentralPlatform } from './fan-central-platform';
import './styles.scss';

async function start(): Promise<void> {
	const container = new Container();
	const platform = container.get(FanCentralPlatform);

	platform.execute();
}

start();
