import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'gaming' || 'ent', // TODO: Set vertical accordingly to the page
		};

		context.set('targeting', targeting);
	}
}
