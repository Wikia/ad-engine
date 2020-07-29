import { AdsMode, PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	billTheLizard,
	communicationService,
	confiant,
	context,
	distroScale,
	durationMedia,
	facebookPixel,
	iasPublisherOptimization,
	JWPlayerManager,
	jwpSetup,
	nielsen,
	permutive,
	Runner,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UcpAdsMode implements AdsMode {
	constructor(private pageTracker: PageTracker) {}

	handleAds(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer(inhibitors);
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

	private async setupJWPlayer(inhibitors = []): Promise<any> {
		new JWPlayerManager().manage();

		const maxTimeout = context.get('options.maxDelayTimeout');
		const runner = new Runner(inhibitors, maxTimeout, 'jwplayer-runner');

		runner.waitForInhibitors().then(() => {
			this.dispatchJWPlayerSetupAction();
		});
	}

	private dispatchJWPlayerSetupAction(): void {
		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(bidders.requestBids());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(wadRunner.call());

		facebookPixel.call();
		permutive.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();
		distroScale.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
			section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
		});
		billTheLizard.call(['vcr']);

		return inhibitors;
	}

	private setAdStack(): void {
		context.push('state.adStack', { id: 'hivi_leaderboard' });
		context.push('state.adStack', { id: 'top_leaderboard' });
		context.push('state.adStack', { id: 'top_boxad' });
		context.push('events.pushOnScroll.ids', 'bottom_leaderboard');
		context.push('state.adStack', { id: 'floor_adhesion' });
		context.push('state.adStack', { id: 'invisible_high_impact_2' });
	}
}
