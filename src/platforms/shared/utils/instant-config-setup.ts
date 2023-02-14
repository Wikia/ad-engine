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
import { container, injectable } from 'tsyringe';

const setInstantConfig = globalAction(
	'[AdEngine] set InstantConfig',
	props<{ instantConfig: InstantConfigService }>(),
);

@injectable()
export class InstantConfigSetup implements DiProcess {
	async execute(): Promise<void> {
		const instantConfig = await new InstantConfigService().init();

		container.register(InstantConfigService, { useValue: instantConfig });
		// @ts-expect-error FIXME wtf?
		container.register(InstantConfigCacheStorage, {
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
