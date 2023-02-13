import { context, DiProcess } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			s1: 'gamespot',
			skin: `gamespot_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
