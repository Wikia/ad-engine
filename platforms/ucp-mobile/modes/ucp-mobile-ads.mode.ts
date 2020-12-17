import { PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
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
export class UcpMobileAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker) {}

	execute(): void {
		const inhibitors = this.callExternals();

		this.setupJWPlayer(inhibitors);
		startAdEngine(inhibitors);

		this.trackAdEngineStatus();
		this.trackTabId();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		permutive.call();

		inhibitors.push(bidders.requestBids());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(wadRunner.call());

		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		durationMedia.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
			section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
		});

		return inhibitors;
	}

	private setupJWPlayer(inhibitors = []): void {
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
}
