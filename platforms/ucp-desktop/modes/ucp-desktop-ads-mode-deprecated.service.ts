import { startAdEngine, wadRunner } from '@platforms/shared';
import {
	adMarketplace,
	anyclip,
	audigent,
	bidders,
	communicationService,
	confiant,
	connatix,
	context,
	DiProcess,
	distroScale,
	durationMedia,
	eventsRepository,
	exCo,
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
	silverSurferService,
	slotDataParamsUpdater,
	slotService,
	stroer,
	taxonomyService,
	UapLoadStatus,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopAdsModeDeprecated implements DiProcess {
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
		if (!incontentPlayer) return;
		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		if (distroScale.isEnabled()) {
			distroScale.call();
		} else if (exCo.isEnabled()) {
			exCo.call();
		} else if (anyclip.isEnabled()) {
			anyclip.call();
		} else if (connatix.isEnabled()) {
			connatix.call();
		}
	}
	private callExternals(): Promise<any>[] {
		const inhibitors: Promise<any>[] = [];

		inhibitors.push(bidders.call());
		inhibitors.push(taxonomyService.call());
		inhibitors.push(silverSurferService.call());
		inhibitors.push(wadRunner.call());

		eyeota.call();
		facebookPixel.call();
		audigent.call();
		iasPublisherOptimization.call();
		confiant.call();
		stroer.call();
		durationMedia.call();
		nielsen.call();
		liveConnect.call();
		identityHub.call();

		adMarketplace.call();
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
