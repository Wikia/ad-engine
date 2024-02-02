import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'tvguide',
			skin: `tvguide_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			MTC: 'No',
		};

		targetingService.extend(targeting);
	}
}
