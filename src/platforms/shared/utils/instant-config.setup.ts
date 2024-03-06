import {
	communicationService,
	context,
	DiProcess,
	globalAction,
	InstantConfigCacheStorage,
	InstantConfigService,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

const setInstantConfig = globalAction(
	'[AdEngine] set InstantConfig',
	props<{ instantConfig: InstantConfigService }>(),
);

@Injectable()
export class InstantConfigSetup implements DiProcess {
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		const { app, env, platform } = window.ads.context;
		const appName = platform ?? app;
		const instantConfigEndpoint =
			env === 'dev' ? 'https://services.fandom-dev.pl' : 'https://services.fandom.com';
		const instantConfigFallbackEndpoint = `https://script.wikia.nocookie.net/fandom-ae-assets/icbm/${
			env ?? 'prod'
		}/icbm_state_${appName}.json`;
		const instantConfig = await new InstantConfigService({
			appName,
			instantConfigEndpoint,
			instantConfigFallbackEndpoint,
			instantConfigVariant: context.get('wiki.services_instantConfig_variant'),
			lockDelay: 0,
		}).init();

		context.set('services.instantConfig.appName', appName);

		this.container.bind(InstantConfigService).value(instantConfig);
		this.container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
		communicationService.dispatch(setInstantConfig({ instantConfig }));
	}
}
