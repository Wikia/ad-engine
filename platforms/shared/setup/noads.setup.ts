import { context, DiProcess, InstantConfigService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class NoAdsSetup implements DiProcess {
	constructor(protected instantConfig: InstantConfigService) {}

	execute(): void {
		const slotName: string = this.instantConfig.get('icDisabledSlots');
		if (slotName) {
			console.log(`hello, disabling ${slotName}`);
			context.set(`slots.${slotName}.disabled`, true);
		}
	}
}
