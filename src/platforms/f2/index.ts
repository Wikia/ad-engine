import { communicationService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { F2Platform } from './f2-platform';
import { F2Environment, f2Ready, F2_ENV } from './setup-f2';
import './styles.scss';

async function load(f2env: F2Environment): Promise<any> {
	const container = new Container();
	container.bind(F2_ENV).value(f2env);
	const platform = container.get(F2Platform);

	platform.execute(f2env);
}

communicationService.once(f2Ready, load);
