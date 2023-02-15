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
		if (
			!context.get('custom.hasFeaturedVideo') &&
			this.isEnabled('services.anyclip.enabled', false)
		) {
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
						this.initIncontentPlayer(slotService.get(slotName));
						return;
					}

					communicationService.on(eventsRepository.ANYCLIP_LATE_INJECT, () => {
						this.initIncontentPlayer(slotService.get(slotName));
					});
				}
			},
		);
	}

	private initIncontentPlayer(incontentPlayer) {
		if (!incontentPlayer) {
			utils.logger('AnyclipPlayerSetup', 'No incontent player - aborting');
			return;
		}

		slotDataParamsUpdater.updateOnCreate(incontentPlayer);
		this.loadAnyclipIfEnabled();
	}
}
