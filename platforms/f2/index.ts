import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';
import { basicContext } from './ad-context';
import { f2Ready } from './setup-f2';
import { setupF2Ioc } from './setup-f2-ioc';
import './styles.scss';

setupPostQuecast();

const communicator = new Communicator();

function onF2Configured(): Promise<Action> {
	return communicator.actions$.pipe(ofType(f2Ready), take(1)).toPromise();
}

async function load(): Promise<any> {
	const f2Action = await onF2Configured();
	const f2Payload = f2Action.payload;

	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupF2Ioc(f2Payload),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: f2Payload.isMobile });

	communicator.dispatch(adEngineConfigured());

	platformStartup.run();
}

communicator.actions$.pipe(ofType(f2Ready), take(1)).subscribe(load);
