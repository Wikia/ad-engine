import { communicationService, ofType } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { F2Platform } from './f2-platform';
import { F2Environment, f2Ready } from './setup-f2';
import './styles.scss';

async function load(f2env: F2Environment): Promise<any> {
	const container = new Container();
	const platform = container.get(F2Platform);

	platform.execute(f2env);
}

communicationService.action$.pipe(ofType(f2Ready), take(1)).subscribe(load);
