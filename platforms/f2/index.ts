import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context, eventService } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { take } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { basicContext } from './ad-context';
import { F2Environment, f2Ready } from './setup-f2';
import { setupF2Ioc } from './setup-f2-ioc';
import './styles.scss';

async function load(f2env: F2Environment): Promise<any> {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupF2Ioc(f2env),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: f2env.isPageMobile });
	eventService.communicator.dispatch(adEngineConfigured());
	platformStartup.run();
}

eventService.communicator.actions$.pipe(ofType(f2Ready), take(1)).subscribe(load);
