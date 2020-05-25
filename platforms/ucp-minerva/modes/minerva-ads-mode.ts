import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	bidders,
	confiant,
	context,
	durationMedia,
	events,
	eventService,
	facebookPixel,
	iasPublisherOptimization,
	permutive,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaAdsMode implements AdsMode {
	constructor(private pageTracker: PageTracker) {}

	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(wadRunner.call());

		facebookPixel.call();
		permutive.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'top_leaderboard' });

		eventService.once(events.FIRST_CALL_ENDED, () => {
			if (universalAdPackage.isFanTakeoverLoaded()) {
				context.push('events.pushOnScroll.ids', 'top_boxad');
				context.push('events.pushOnScroll.ids', 'incontent_boxad_1');
				context.push('events.pushOnScroll.ids', 'footer_boxad');
			} else {
				context.push('state.adStack', { id: 'top_boxad' });
				context.push('state.adStack', { id: 'incontent_boxad_1' });
				context.push('state.adStack', { id: 'footer_boxad' });
			}
			context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
		});
	}
}
