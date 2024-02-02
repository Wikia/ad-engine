import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

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

	getVerticalName(): 'gaming' | 'ent' {
		return window.utag_data?.siteSection === 'games' ? 'gaming' : 'ent';
	}

	getPageType(): string | undefined {
		return window.utag_data?.pageType;
	}
}
