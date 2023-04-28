import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class MetacriticTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getVerticalName(),
			ptype: this.getPageType(),
			s1: 'metacritic',
			skin: `metacritic_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}

	getVerticalName(): string | undefined {
		let verticalName;

		if (window.utag_data?.siteSection) {
			verticalName = window.utag_data.siteSection === 'games' ? 'gaming' : 'ent';
		} else {
			verticalName = targetingService.get('verticalName');
		}

		return verticalName;
	}

	getPageType(): string | undefined {
		return window.utag_data?.pageType || targetingService.get('ptype');
	}
}
