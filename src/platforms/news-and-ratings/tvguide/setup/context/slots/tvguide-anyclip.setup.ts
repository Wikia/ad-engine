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

		if (this.shouldPlayerBeIncontent(pname)) {
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
	}

	private insertPlaceholders(): void {
		const listingScheduleRow = document.querySelector('.c-tvListingsSchedule_video');
		listingScheduleRow.appendChild(this.buildRow());
	}

	private buildRow(): HTMLElement {
		const listingScheduleRow = document.createElement('div');
		listingScheduleRow.classList.add('c-tvListingsVideo-container', 'ae-anyclip-row');

		const listingVideoContainer = document.createElement('div');
		listingVideoContainer.classList.add('c-tvListingsVideo-container', 'ae-anyclip-container');

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
