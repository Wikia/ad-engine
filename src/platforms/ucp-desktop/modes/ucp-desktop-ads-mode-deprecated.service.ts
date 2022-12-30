import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	userIdentity,
	Anyclip,
	AnyclipTracker,
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	durationMedia,
	eventsRepository,
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
	slotDataParamsUpdater,
	slotService,
	stroer,
	UapLoadStatus,
	utils,
	ats,
	liveRampPixel,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsModeDeprecated implements DiProcess {
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

	private initIncontentPlayer(incontentPlayer) {
		const anyclip = new Anyclip(new AnyclipTracker(Anyclip.SUBSCRIBE_FUNC_NAME));

		if (!incontentPlayer) return;
		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		if (anyclip.isEnabled()) {
			anyclip.call();
		}
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
		liveConnect.call();
		identityHub.call();

		prebidNativeProvider.call();

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded, adProduct }: UapLoadStatus) => {
				if (!isLoaded && adProduct !== 'ruap') {
					this.initIncontentPlayer(slotService.get('incontent_player'));
				}
			},
		);

		return inhibitors;
	}
}
