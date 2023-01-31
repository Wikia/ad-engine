import { context, DiProcess } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			is_mobile: context.get('state.isMobile') ? '1' : '0',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
