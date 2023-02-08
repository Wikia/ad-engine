import { context, DiProcess } from '@wikia/ad-engine';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'tvguide',
			skin: 'tvguide',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
