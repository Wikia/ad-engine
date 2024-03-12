import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

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
