import {
	Anyclip,
	AnyclipTracker,
	BaseServiceSetup,
	communicationService,
	connatix,
	distroScale,
	eventsRepository,
	exCo,
	slotDataParamsUpdater,
	slotService,
	UapLoadStatus,
} from '@wikia/ad-engine';

class PlayerExperimentSetup extends BaseServiceSetup {
	private initIncontentPlayer(incontentPlayer) {
		const anyclip = new Anyclip(new AnyclipTracker());

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

	call() {
		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded, adProduct }: UapLoadStatus) => {
				if (!isLoaded && adProduct !== 'ruap') {
					this.initIncontentPlayer(slotService.get('incontent_player'));
				}
			},
		);
	}
}

export const playerExperimentSetup = new PlayerExperimentSetup();
