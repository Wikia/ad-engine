import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	confiant,
	DiProcess,
	durationMedia,
	iasPublisherOptimization,
	liveConnect,
	liveRampPixel,
	userIdentity,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsDeprecatedMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.call());
		inhibitors.push(wadRunner.call());
		inhibitors.push(userIdentity.execute());

		audigent.call();
		liveConnect.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();
		liveRampPixel.call();

		return inhibitors;
	}
}
