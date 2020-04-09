import { adEngineConfigured, bootstrapAndGetConsent, PlatformStartup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { Action, Communicator, setupPostQuecast } from '@wikia/post-quecast';
import { take } from 'rxjs/operators';
import { action } from 'ts-action';
import { ofType } from 'ts-action-operators';
import { basicContext } from './ad-context';
import { setupF2Ioc } from './setup-f2-ioc';
import './styles.scss';

setupPostQuecast();

export const f2ready = action('[F2] Configured');

function onF2Configured(): Promise<Action> {
	const communicator = new Communicator();

	return communicator.actions$.pipe(ofType(f2ready), take(1)).toPromise();
}

const load = async () => {
	const communicator = new Communicator();
	const f2Action = await onF2Configured();
	const f2Payload = f2Action.payload;

	context.extend(basicContext);

	const [container]: [Container, ...any[]] = await Promise.all([
		setupF2Ioc(),
		bootstrapAndGetConsent(),
	]);
	const platformStartup = container.get(PlatformStartup);

	platformStartup.configure({ isMobile: f2Payload.isMobile });

	communicator.dispatch(adEngineConfigured());

	platformStartup.run();
};

load();
