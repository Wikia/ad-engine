import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	confiant,
	context,
	durationMedia,
	facebookPixel,
	iasPublisherOptimization,
	permutive,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { v4 as uuid } from 'uuid';

@Injectable()
export class HydraAdsMode implements AdsMode {
	constructor(private pageTracker: PageTracker) {}

	handleAds(): void {
		const inhibitors = this.callExternals();

		startAdEngine(inhibitors);

		this.setAdStack();
		this.trackAdEngineStatus();
		this.trackTabId();
	}

	private trackAdEngineStatus(): void {
		this.pageTracker.trackProp('adengine', `on_${window.ads.adEngineVersion}`);
	}

	private trackTabId(): void {
		if (!context.get('options.tracking.tabId')) {
			return;
		}

		window.tabId = sessionStorage.tab_id ? sessionStorage.tab_id : (sessionStorage.tab_id = uuid());

		this.pageTracker.trackProp('tab_id', window.tabId);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.requestBids());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(wadRunner.call());

		facebookPixel.call();
		permutive.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('state.adStack', { id: 'top_boxad' });
		context.push('state.adStack', { id: 'incontent_boxad_1' });
		context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
		context.push('events.pushOnScroll.ids', 'footer_boxad');
	}
}
