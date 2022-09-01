import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	confiant,
	DiProcess,
	durationMedia,
	iasPublisherOptimization,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class SportsAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.call());
		inhibitors.push(wadRunner.call());

		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}
}
