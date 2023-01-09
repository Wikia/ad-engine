import { context, DiProcess } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
