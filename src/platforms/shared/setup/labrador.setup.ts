import { InstantConfigCacheStorage, InstantConfigService, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
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
