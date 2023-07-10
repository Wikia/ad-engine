import {
	DiProcess,
	InstantConfigCacheStorage,
	InstantConfigService,
	targetingService,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class LabradorSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		const cacheStorage = InstantConfigCacheStorage.make();
		// Need to be placed always after all lABrador icVars checks
		targetingService.set(
			'labrador',
			cacheStorage.mapSamplingResults(this.instantConfig.get('icLABradorGamKeyValues')),
		);
	}
}
