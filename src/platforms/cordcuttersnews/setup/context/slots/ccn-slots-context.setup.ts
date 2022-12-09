import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class CcnSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'div-gpt-ad-headerad': {
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'top',
					pos: 'dlb1',
				},
			},
			'div-gpt-ad-hero': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'middle',
					pos: 'dmr4',
				},
			},
			'div-gpt-ad-abovecontent': {
				defaultSizes: [[468, 60]],
				targeting: {
					loc: 'middle',
					pos: 'dlb2',
				},
			},
			'div-gpt-ad-catsidebar': {
				defaultSizes: [[300, 250]],
				targeting: {
					loc: 'middle',
					pos: 'dmr4',
				},
			},
		};

		context.set('slots', slots);
	}
}
