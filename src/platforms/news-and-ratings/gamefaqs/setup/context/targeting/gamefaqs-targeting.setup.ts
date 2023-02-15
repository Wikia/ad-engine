import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class GamefaqsTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			s1: 'gamefaqs',
			skin: `gamefaqs_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}
}
