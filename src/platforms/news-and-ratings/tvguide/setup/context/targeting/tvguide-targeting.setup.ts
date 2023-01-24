import { context, DiProcess } from '@wikia/ad-engine';

export class TvGuideTargetingSetup implements DiProcess {
	execute(): void {
		// TODO: Map key 'network' to 'tv' (ADEN-12567)
		const targeting = {
			s0: 'ent',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
