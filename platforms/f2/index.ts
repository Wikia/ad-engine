import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { basicContext } from './ad-context';
import { F2Config, f2Ready } from './setup-f2';
import { setupF2Ioc } from './setup-f2-ioc';
import './styles.scss';

setupPostQuecast();

const communicator = new Communicator();

async function load(f2config: F2Config): Promise<any> {
	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupF2Ioc(f2config),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: f2config.isMobile });
	communicator.dispatch(adEngineConfigured());
	platformStartup.run();
}

communicator.actions$.pipe(ofType(f2Ready), take(1)).subscribe(load);
