import { context, DiProcess } from '@wikia/ad-engine';

export class GamefaqsTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming',
			s1: 'gamefaqs',
			skin: 'gamefaqs',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
