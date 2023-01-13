import { DiProcess, targetingService } from '@wikia/ad-engine';

export class MetacriticTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getVerticalName(),
		};

		targetingService.extend(targeting);
	}

	getVerticalName(): 'gaming' | 'ent' {
		return window.utag_data?.siteSection === 'games' ? 'gaming' : 'ent';
	}
}
