import { DiProcess, targetingService } from '@wikia/ad-engine';

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
