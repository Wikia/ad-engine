import { AdEnginePreStarter, biddersDelay } from '@platforms/shared';
import { bidders } from '@wikia/ad-engine';

export class SportsAdEnginePreStarter implements AdEnginePreStarter {
	runPreStartActions(): void {
		this.callExternals();
	}

	private callExternals(): void {
		bidders.requestBids({
			responseListener: biddersDelay.markAsReady,
		});
	}
}
