import { context, DiProcess } from '@wikia/ad-engine';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'tvguide',
			skin: `tvguide_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
