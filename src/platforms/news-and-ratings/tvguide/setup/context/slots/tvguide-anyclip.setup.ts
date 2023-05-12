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
	private currentDocumentTitle;

	execute(): void {
		this.currentDocumentTitle = window.document.title;

		context.set('services.anyclip.isApplicable', () => {
			const pname = targetingService.get('pname');
			const isApplicable = this.isApplicable(pname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});

		communicationService.on(
			eventsRepository.PLATFORM_PAGE_CHANGED,
			() => {
				const pname = targetingService.get('pname');
				const isPageTransition = this.currentDocumentTitle !== window.document.title;

				if (window?.anyclip?.loaded && isPageTransition && !this.isApplicable(pname)) {
					utils.logger(this.logGroup, 'Destroying Anyclip widget', pname);
					window?.anyclip?.destroy();
				}
			},
			false,
		);
	}

	isApplicable(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub'];

		return applicablePnames.indexOf(pname) !== -1;
	}
}
