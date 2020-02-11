import { CurseUapSetup, DynamicSlotsSetup } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FutheadDynamicSlotsSetup implements DynamicSlotsSetup {
	constructor(private uapSetup: CurseUapSetup) {}

	configureDynamicSlots(): void {
		this.uapSetup.configureUap();
	}
}
