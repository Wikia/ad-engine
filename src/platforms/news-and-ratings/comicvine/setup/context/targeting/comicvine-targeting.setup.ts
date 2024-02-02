import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

export class ComicvineTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'comicvine',
			skin: `comicvine_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}
}
