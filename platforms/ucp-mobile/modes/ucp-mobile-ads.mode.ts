import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	adMarketplace,
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eyeota,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	jwPlayerInhibitor,
	JWPlayerManager,
	jwpSetup,
	liveConnect,
	nielsen,
	optimera,
	prebidNativeProvider,
	Runner,
	silverSurferService,
	stroer,
	taxonomyService,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		const jwpInhibitor = [jwPlayerInhibitor.get()];
		const jwpMaxTimeout = context.get('options.jwpMaxDelayTimeout');
		new Runner(jwpInhibitor, jwpMaxTimeout, 'jwplayer-inhibitor').waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});

		utils.translateLabels();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];
		const targeting = context.get('targeting');

		inhibitors.push(bidders.requestBids());
		inhibitors.push(optimera.call());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(silverSurferService.configureUserTargeting());
		inhibitors.push(wadRunner.call());

		eyeota.call();
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
		prebidNativeProvider.initialize();
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
}
