import { context, InstantConfigCacheStorage, InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class LabradorSetup {
	constructor(protected instantConfig: InstantConfigService) {}

	configure(): void {
		const cacheStorage = InstantConfigCacheStorage.make();
		// Need to be placed always after all lABrador icVars checks
		context.set(
			'targeting.labrador',
			cacheStorage.mapSamplingResults(this.instantConfig.get('icLABradorGamKeyValues')),
		);
	}
}
