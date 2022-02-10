import { PageTracker, startAdEngine, wadRunner } from '@platforms/shared';
import {
	adMarketplace,
	anyclip,
	audigent,
	bidders,
	communicationService,
	confiant,
	context,
	DiProcess,
	distroScale,
	durationMedia,
	eventsRepository,
	exCo,
	facebookPixel,
	iasPublisherOptimization,
	jwPlayerInhibitor,
	JWPlayerManager,
	jwpSetup,
	nielsen,
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
import { v4 as uuid } from 'uuid';

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

		window.tabId = sessionStorage.tab_id ? sessionStorage.tab_id : (sessionStorage.tab_id = uuid());

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

		inhibitors.push(bidders.requestBids());
		inhibitors.push(taxonomyService.configurePageLevelTargeting());
		inhibitors.push(wadRunner.call());
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
					}
				}
			},
		);

		return inhibitors;
	}
}
