import { CurseUapSetup } from '@platforms/shared';
import { DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MutheadDynamicSlotsSetup implements DiProcess {
	constructor(private uapSetup: CurseUapSetup) {}

	execute(): void {
		this.uapSetup.configureUap();
	}
}
