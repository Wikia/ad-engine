import {
	Audigent,
	communicationService,
	context,
	DiProcess,
	globalAction,
	InstantConfigCacheStorage,
	InstantConfigService,
	intentIQ,
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
		// @ts-expect-error Typescript will fail here - cannot assign public constructor type to private one
		container.register(InstantConfigCacheStorage, {
			useFactory: InstantConfigCacheStorage.make(),
		});
		communicationService.dispatch(setInstantConfig({ instantConfig }));

		this.preloadLibraries(instantConfig);
	}

	private preloadLibraries(instantConfig: InstantConfigService) {
		if (instantConfig.get('icPrebid')) {
			context.set('bidders.prebid.libraryUrl', instantConfig.get('icPrebidVersion'));

			pbjsFactory.init().then(() => {
				if (instantConfig.get('icPrebidIntentIQ')) {
					return intentIQ.preloadScript();
				}
			});
		}

		if (instantConfig.get('icAudigent')) {
			Audigent.loadSegmentLibrary();
		}
	}
}
