import { startAdEngine } from '@platforms/shared';
import {
	audigent,
	communicationService,
	confiant,
	context,
	DiProcess,
	facebookPixel,
	iasPublisherOptimization,
	identityHub,
	JWPlayerManager,
	jwpSetup,
	nielsen,
	Runner,
	silverSurferService,
	stroer,
	taxonomyService,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpMobileLighterLegacyAdsMode implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		startAdEngine(inhibitors);
	}

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(taxonomyService.call());
		inhibitors.push(silverSurferService.call());

		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		nielsen.call();

		identityHub.call();

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
