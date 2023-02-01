import {
	Anyclip,
	AnyclipTracker,
	BaseServiceSetup,
	communicationService,
	context,
	eventsRepository,
	slotDataParamsUpdater,
	slotService,
	UapLoadStatus,
} from '@wikia/ad-engine';

export class AnyclipPlayerSetup extends BaseServiceSetup {
	private initIncontentPlayer(incontentPlayer) {
		if (incontentPlayer) {
			slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		}

		if (this.isEnabled('services.anyclip.enabled', false)) {
			new Anyclip(
				context.get('services.anyclip.pubname'),
				context.get('services.anyclip.widgetname'),
				context.get('services.anyclip.libraryUrl'),
				new AnyclipTracker(Anyclip.SUBSCRIBE_FUNC_NAME),
			).loadPlayerAsset();
		}
	}

	call() {
		if (context.get('services.anyclip.loadOnPageLoad')) {
			this.initIncontentPlayer(null);
		} else {
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
}
