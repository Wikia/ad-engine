import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	userIdentity,
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
	prebidNativeProvider,
	Runner,
	stroer,
	utils,
	ats,
	liveRampPixel,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileDeprecatedAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		const requiredInhibitors = [jwPlayerInhibitor.get(), userIdentity.initialized];
		const jwpMaxTimeout = context.get('options.jwpMaxDelayTimeout');
		new Runner(requiredInhibitors, jwpMaxTimeout).waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});

		utils.translateLabels();
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.call());
		inhibitors.push(wadRunner.call());
		inhibitors.push(userIdentity.execute());

		ats.call();
		eyeota.call();
		facebookPixel.call();
		liveRampPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		durationMedia.call();
		nielsen.call();

		adMarketplace.call();
		prebidNativeProvider.call();
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
