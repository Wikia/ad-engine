import {
	UapLoadStatus,
	BaseServiceSetup,
	jwpSetup,
	communicationService,
	eventsRepository,
	slotDataParamsUpdater,
	distroScale,
	exCo,
	anyclip,
	connatix,
	slotService,
	JWPlayerManager,
} from '@wikia/ad-engine';

class PlayerSetup extends BaseServiceSetup {
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

	initialize() {
		new JWPlayerManager().manage();

		communicationService.dispatch(jwpSetup({ showAds: true, autoplayDisabled: false }));
		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded, adProduct }: UapLoadStatus) => {
				if (!isLoaded && adProduct !== 'ruap') {
					this.initIncontentPlayer(slotService.get('incontent_player'));
				}
			},
		);

		this.res();
	}
}

export const playerSetup = new PlayerSetup();
