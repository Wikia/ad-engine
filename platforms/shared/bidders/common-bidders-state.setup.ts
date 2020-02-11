import { context, InstantConfigService, setupBidders } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { BiddersStateSetup } from '../setup/_bidders-state.setup';

@Injectable()
export class CommonBiddersStateSetup implements BiddersStateSetup {
	constructor(private instantConfig: InstantConfigService) {}

	configureBiddersState(): void {
		setupBidders(context, this.instantConfig);
	}
}
