import { CurseUapSetup } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MutheadDynamicSlotsSetup implements DiProcess {
	constructor(private uapSetup: CurseUapSetup) {}

	execute(): void {
		if (this.isUapAllowed()) {
			this.uapSetup.configureUap();
		}
	}

	private isUapAllowed(): boolean {
		return context.get('targeting.s2') !== 'old';
	}
}
