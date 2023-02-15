import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class GiantbombTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			s1: 'giantbomb',
			skin: `giantbomb_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			seg: '',
			aamid: '',
		};

		targetingService.extend(targeting);
	}
}
