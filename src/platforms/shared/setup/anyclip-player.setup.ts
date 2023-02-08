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
	utils,
} from '@wikia/ad-engine';

export class AnyclipPlayerSetup extends BaseServiceSetup {
	call() {
		if (context.get('services.anyclip.loadOnPageLoad')) {
			this.loadAnyclipIfEnabled();
		} else {
			this.registerAnyclipToLoadOnUapLoadStatus();
		}
	}

	private loadAnyclipIfEnabled() {
		if (this.isEnabled('services.anyclip.enabled', false)) {
			new Anyclip(
				context.get('services.anyclip.pubname'),
				context.get('services.anyclip.widgetname'),
				context.get('services.anyclip.libraryUrl'),
				context.get('services.anyclip.isApplicable'),
				new AnyclipTracker(Anyclip.SUBSCRIBE_FUNC_NAME),
			).loadPlayerAsset();
		}
	}

	private registerAnyclipToLoadOnUapLoadStatus() {
		const slotName = 'incontent_player';

		communicationService.on(
			eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
			({ isLoaded, adProduct }: UapLoadStatus) => {
				if (!isLoaded && adProduct !== 'ruap') {
					if (!context.get('services.anyclip.latePageInject')) {
						console.log('slotService: ', slotService);
						this.initIncontentPlayer(slotService.get(slotName));
						return;
					}

					communicationService.on(
						eventsRepository.AD_ENGINE_SLOT_ADDED,
						({ slot }) => {
							if (slot.getSlotName() === slotName) {
								slot.getPlaceholder()?.classList.remove('is-loading');
								this.initIncontentPlayer(slotService.get(slotName));
							}
						},
						false,
					);
				}
			},
		);
	}

	private initIncontentPlayer(incontentPlayer) {
		console.log('incontentPlayer: ', incontentPlayer);

		if (!incontentPlayer) {
			utils.logger('AnyclipPlayerSetup', 'No incontent player - aborting');
			return;
		}

		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		this.loadAnyclipIfEnabled();
	}
}
