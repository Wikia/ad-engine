import { context } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class BingeBotSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			sponsored_logo: {
				adProduct: 'sponsored-logo',
				group: 'PX',
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
