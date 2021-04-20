import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotSlotsContextSetup implements DiProcess {
	constructor() {}

	execute(): void {
		const slots = {
			promoted_recs: {
				firstCall: true,
				adProduct: 'promoted-recs',
				group: 'PX',
				slotNameSuffix: '',
				outOfPage: true,
				targeting: {
					pos: ['promoted_recs'],
				},
			},
			sponsored_logo: {
				adProduct: 'sponsored-logo',
				group: 'PX',
				slotNameSuffix: '',
				defaultSizes: [
					[100, 46],
					[120, 120],
				],
				targeting: {
					pos: ['sponsored_logo'],
				},
			},
		};

		context.set('slots', slots);
	}
}
