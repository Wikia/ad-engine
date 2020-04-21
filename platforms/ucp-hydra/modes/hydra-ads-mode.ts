import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import { bidders, confiant, context, durationMedia, permutive } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraAdsMode implements AdsMode {
	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		PageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(wadRunner.call());

		permutive.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
	}
}
