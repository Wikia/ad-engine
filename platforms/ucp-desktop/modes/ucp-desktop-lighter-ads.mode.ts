import { PageTracker, startAdEngine } from '@platforms/shared';
import {
	audigent,
	communicationService,
	confiant,
	context,
	DiProcess,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	JWPlayerManager,
	jwpSetup,
	nielsen,
	Runner,
	silverSurferService,
	stroer,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { nanoid } from 'nanoid';

@Injectable()
export class UcpDesktopLighterAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker) {}

	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		const jwpInhibitor = [jwPlayerInhibitor.get()];
		const jwpMaxTimeout = context.get('options.jwpMaxDelayTimeout');
		new Runner(jwpInhibitor, jwpMaxTimeout, 'jwplayer-inhibitor').waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});

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

		window.tabId = sessionStorage.tab_id
			? sessionStorage.tab_id
			: (sessionStorage.tab_id = nanoid());

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

		inhibitors.push(identityHub.call());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(silverSurferService.configureUserTargeting());

		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
			section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
		});

		return inhibitors;
	}
}
