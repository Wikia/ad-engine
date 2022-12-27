import {
	Anyclip,
	AnyclipTracker,
	BaseServiceSetup,
	communicationService,
	eventsRepository,
	slotDataParamsUpdater,
	slotService,
	UapLoadStatus,
} from '@wikia/ad-engine';

class AnyclipPlayerSetup extends BaseServiceSetup {
	private initIncontentPlayer(incontentPlayer) {
		const anyclip = new Anyclip(new AnyclipTracker(Anyclip.SUBSCRIBE_FUNC_NAME));

		if (!incontentPlayer) return;
		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		if (anyclip.isEnabled()) {
			anyclip.call();
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

export const anyclipPlayerSetup = new AnyclipPlayerSetup();
