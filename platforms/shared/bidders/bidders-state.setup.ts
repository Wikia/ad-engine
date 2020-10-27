import { context, DiProcess, InstantConfigService, setupBidders } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BiddersStateSetup implements DiProcess {
	constructor(private instantConfig: InstantConfigService) {}

	execute(): void {
		setupBidders(context, this.instantConfig);
	}
}
