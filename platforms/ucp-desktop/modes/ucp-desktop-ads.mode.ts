import { PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
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
	optimera,
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
import { nanoid } from 'nanoid';

@Injectable()
export class UcpDesktopAdsMode implements DiProcess {
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

		utils.translateLabels();
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
		const targeting = context.get('targeting');

		inhibitors.push(bidders.requestBids());
		inhibitors.push(optimera.call());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(silverSurferService.configureUserTargeting());
		inhibitors.push(wadRunner.call());

		eyeota.call()
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
		liveConnect.call();
		identityHub.call();

		adMarketplace.initialize();

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded }: UapLoadStatus) => {
				const incontentPlayer = slotService.get('incontent_player');
				if (!isLoaded && incontentPlayer) {
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
			},
		);

		return inhibitors;
	}
}
