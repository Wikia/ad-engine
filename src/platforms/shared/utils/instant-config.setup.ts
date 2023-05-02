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
	constructor(private container: Container) {}

	async execute(): Promise<void> {
		const instantConfig = await new InstantConfigService().init();

		this.container.bind(InstantConfigService).value(instantConfig);
		this.container.bind(InstantConfigCacheStorage).value(InstantConfigCacheStorage.make());
		communicationService.dispatch(setInstantConfig({ instantConfig }));

		this.preloadLibraries(instantConfig);
	}

	private preloadLibraries(instantConfig: InstantConfigService) {
		if (instantConfig.get('icPrebid')) {
			context.set(
				'bidders.prebid.libraryUrl',
				'//script.wikia.nocookie.net/fandom-ae-assets/platforms/dev/ADEN-12643/prebid/20230430.min.js',
			);
			pbjsFactory.init();
		}

		if (instantConfig.get('icAudigent')) {
			Audigent.loadSegmentLibrary();
		}
	}
}
