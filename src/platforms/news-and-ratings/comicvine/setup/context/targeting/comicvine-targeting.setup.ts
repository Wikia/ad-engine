import { context, DiProcess } from '@wikia/ad-engine';

export class ComicvineTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
