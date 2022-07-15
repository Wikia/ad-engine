import { PageTracker, startAdEngine } from '@platforms/shared';
import {
	adMarketplace,
	audigent,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	JWPlayerManager,
	jwpSetup,
	liveConnect,
	nielsen,
	Runner,
	silverSurferService,
	stroer,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileLighterAdsMode implements DiProcess {
	constructor(private pageTracker: PageTracker) {}

	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		startAdEngine(inhibitors);

		this.trackAdEngineStatus();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(silverSurferService.configureUserTargeting());

		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		durationMedia.call();
		nielsen.call({
			type: 'static',
			assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
			section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
		});

		adMarketplace.initialize();
		identityHub.call();
		liveConnect.call();

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
}
