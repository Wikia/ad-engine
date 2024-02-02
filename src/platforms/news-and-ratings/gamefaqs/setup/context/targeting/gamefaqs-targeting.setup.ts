import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

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
