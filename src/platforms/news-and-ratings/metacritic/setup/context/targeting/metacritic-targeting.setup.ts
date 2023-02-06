import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getVerticalName(),
			ptype: this.getPageType(),
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}

	getVerticalName(): 'gaming' | 'ent' {
		return window.utag_data?.siteSection === 'games' ? 'gaming' : 'ent';
	}

	getPageType(): string {
		return window.utag_data?.pageType;
	}
}
