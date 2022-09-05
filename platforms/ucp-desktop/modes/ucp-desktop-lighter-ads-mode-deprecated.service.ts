import { startAdEngine } from '@platforms/shared';
import {
	userIdentity,
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
	ats,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopLighterAdsModeDeprecated implements DiProcess {
	execute(): void {
		const inhibitors = this.callExternals();
		this.setupJWPlayer(inhibitors);

		const requiredInhibitors = [userIdentity.initialized];
		const maxTimeout = context.get('options.maxDelayTimeout');
		new Runner(requiredInhibitors, maxTimeout).waitForInhibitors().then(() => {
			startAdEngine(inhibitors);
		});
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

	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(silverSurferService.call());
		inhibitors.push(userIdentity.call());

		ats.call();
		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		nielsen.call();
		identityHub.call();

		return inhibitors;
	}
}
