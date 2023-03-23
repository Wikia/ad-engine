import '@abraham/reflection';
import { container } from 'tsyringe';
import { SportsPlatform } from './sports-platform';
import './styles.scss';

async function start(): Promise<void> {
	const platform = container.resolve(SportsPlatform);

	platform.execute();
}

start();
