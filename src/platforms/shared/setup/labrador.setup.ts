// @ts-strict-ignore
import { DiProcess, InstantConfigService, targetingService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class LabradorSetup implements DiProcess {
	constructor(protected readonly instantConfig: InstantConfigService) {}

	execute(): void {
		targetingService.set('labrador', this.instantConfig.getActiveLabradorKeyValues());
	}
}
