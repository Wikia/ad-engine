import {
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	targetingService,
	utils,
} from '@wikia/ad-engine';

export class TvGuideAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';

	execute(): void {
		const pname = targetingService.get('pname');

		context.set('services.anyclip.isApplicable', () => {
			const isApplicable = this.isApplicable(pname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});

		this.updateContextForMiniplayerAnyclip();

		if (this.shouldPlayerBeIncontent(pname)) {
			utils.logger(this.logGroup, 'player should be in-content');

			this.updateContextForIncontentAnyclip();
			this.registerSlotInsertionOnAdPlacementReady();
		}
	}

	private updateContextForMiniplayerAnyclip(): void {
		context.set('services.anyclip.widgetname', '001w000001Y8ud2AAB_M7985');
		context.set('services.anyclip.playerElementSelector', null);
		context.set('services.anyclip.loadOnPageLoad', true);
		context.set('services.anyclip.latePageInject', false);
		context.set('custom.hasIncontentPlayer', false);
	}

	private updateContextForIncontentAnyclip(): void {
		context.set('services.anyclip.widgetname', '001w000001Y8ud2AAB_M8046');
		context.set('services.anyclip.playerElementSelector', '#incontent_player');
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', true);
		context.set('custom.hasIncontentPlayer', true);
	}

	private registerSlotInsertionOnAdPlacementReady(): void {
		communicationService.on(
			eventsRepository.PLATFORM_AD_PLACEMENT_READY,
			({ placementId }) => {
				if (placementId === 'leader-top') {
					utils.logger(this.logGroup, 'inserting placeholders');
					this.insertPlaceholders();
				}
			},
			false,
		);
	}

	private insertPlaceholders(): void {
		const listingScheduleRow = document.querySelector('.c-tvListingsSchedule_video');
		const success = listingScheduleRow?.appendChild(this.buildRow());

		if (success) {
			communicationService.emit(eventsRepository.ANYCLIP_LATE_INJECT);
			// TODO: remove once we have 100% UAP implemented on N&R
			communicationService.emit(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS, { isLoaded: false });
		}
	}

	private buildRow(): HTMLElement {
		const listingScheduleRow = document.createElement('div');
		listingScheduleRow.classList.add('c-tvListingsVideo-container');
		listingScheduleRow.id = 'aeAnyclipRow';

		const listingVideoContainer = document.createElement('div');
		listingVideoContainer.classList.add('c-tvListingsVideo-container');
		listingVideoContainer.id = 'aeAnyclipContainer';

		const videoElement = document.createElement('div');
		videoElement.classList.add('c-tvListingsVideo_media', 'g-outer-spacing-bottom-medium');
		videoElement.id = 'incontent_player';

		listingVideoContainer.appendChild(videoElement);
		listingScheduleRow.appendChild(listingVideoContainer);

		return listingScheduleRow;
	}

	shouldPlayerBeIncontent(pname: string): boolean {
		const incontentPnames = ['listings/main'];

		return this.isApplicable(pname) && incontentPnames.indexOf(pname) !== -1;
	}

	isApplicable(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub', 'listings/main'];

		return applicablePnames.indexOf(pname) !== -1;
	}
}
