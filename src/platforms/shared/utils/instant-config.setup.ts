import {
	communicationService,
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
		const start = Date.now();
		const instantConfig = await new InstantConfigService().init();
		console.debug('[AEPERF] InstantConfigSetup', Date.now() - start, 'ms');

		this.container.bind(InstantConfigService).value(instantConfig);
		this.container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
		communicationService.dispatch(setInstantConfig({ instantConfig }));
	}
}
