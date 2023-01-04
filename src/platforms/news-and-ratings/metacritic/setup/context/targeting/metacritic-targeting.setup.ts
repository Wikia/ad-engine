import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getVerticalName(),
		};

		context.set('targeting', targeting);
	}

	getVerticalName(): 'gaming' | 'ent' {
		return window.utag_data?.siteSection === 'games' ? 'gaming' : 'ent';
	}
}
