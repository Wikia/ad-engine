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
import { props } from 'ts-action';
import { DependencyContainer, injectable } from 'tsyringe';

const setInstantConfig = globalAction(
	'[AdEngine] set InstantConfig',
	props<{ instantConfig: InstantConfigService }>(),
);

@injectable()
export class InstantConfigSetup implements DiProcess {
	constructor(private container: DependencyContainer) {}

	async execute(): Promise<void> {
		const instantConfig = await new InstantConfigService().init();

		this.container.register(InstantConfigService, { useValue: instantConfig });
		// @ts-expect-error FIXME wtf?
		this.container.register(InstantConfigCacheStorage, {
			useValue: InstantConfigCacheStorage.make(),
		});
		communicationService.dispatch(setInstantConfig({ instantConfig }));

		this.preloadLibraries(instantConfig);
	}

	private preloadLibraries(instantConfig: InstantConfigService) {
		if (instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.libraryUrl', instantConfig.get('icPrebidVersion'));
			pbjsFactory.init();
		}

		if (instantConfig.get('icAudigent')) {
			Audigent.loadSegmentLibrary();
		}
	}
}
