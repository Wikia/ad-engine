import {
	Audigent,
	communicationService,
	context,
	DiProcess,
	globalAction,
	InstantConfigCacheStorage,
	InstantConfigService,
	pbjsFactory,
} from '@wikia/ad-engine';
import { Container, Injectable } from '@wikia/dependency-injection';
import { props } from 'ts-action';

const setInstantConfig = globalAction(
	'[AdEngine] set InstantConfig',
	props<{ instantConfig: InstantConfigService }>(),
);

@Injectable()
export class InstantConfigSetup implements DiProcess {
	constructor(private container: Container, private audigent: Audigent) {}

	async execute(): Promise<void> {
		const instantConfig = await InstantConfigService.init();

		this.container.bind(InstantConfigService).value(instantConfig);
		this.container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
		communicationService.dispatch(setInstantConfig({ instantConfig }));

		this.preloadLibraries(instantConfig);
	}

	private preloadLibraries(instantConfig: InstantConfigService) {
		if (instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.libraryUrl', instantConfig.get('icPrebidVersion'));
			pbjsFactory.init();
		}

		if (instantConfig.get('icAudigent')) {
			this.audigent.init(instantConfig);
		}
	}
}
