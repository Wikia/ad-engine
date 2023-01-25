import { context, DiProcess } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			uap: 'none',
			uap_c: 'none',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
