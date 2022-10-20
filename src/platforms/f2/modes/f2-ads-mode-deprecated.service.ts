import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	context,
	DiProcess,
	iasPublisherOptimization,
	jwPlayerInhibitor,
	JWPlayerManager,
	liveConnect,
	liveRampPixel,
	nielsen,
	Runner,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2DeprecatedAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer();

		const requiredInhibitors = [jwPlayerInhibitor.get(), userIdentity.initialized];
		const maxTimeout = context.get('options.maxDelayTimeout');
		new Runner(requiredInhibitors, maxTimeout).waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});
	}

	private async setupJWPlayer(): Promise<any> {
		new JWPlayerManager().manage();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(wadRunner.call());
		inhibitors.push(userIdentity.call());

		liveRampPixel.call();
		audigent.call();
		liveConnect.call();
		iasPublisherOptimization.call();
		nielsen.call();

		return inhibitors;
	}
}
