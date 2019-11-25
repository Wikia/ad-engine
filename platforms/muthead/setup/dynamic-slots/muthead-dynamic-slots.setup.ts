import { CurseUapSetup, DynamicSlotsSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MutheadDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(private uapSetup: CurseUapSetup) {}

	configureDynamicSlots(): void {
		if (this.isUapAllowed()) {
			this.uapSetup.configureUap();
		}
	}

	private isUapAllowed(): boolean {
		return context.get('targeting.s2') !== 'old';
	}
}
