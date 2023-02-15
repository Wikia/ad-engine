import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			s1: 'gamespot',
			skin: `gamespot_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			seg: '',
			aamid: '',
		};

		targetingService.extend(targeting);
	}
}
