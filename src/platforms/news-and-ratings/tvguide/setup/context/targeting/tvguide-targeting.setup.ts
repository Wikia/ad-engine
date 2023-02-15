import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'tvguide',
			skin: `tvguide_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}
}
