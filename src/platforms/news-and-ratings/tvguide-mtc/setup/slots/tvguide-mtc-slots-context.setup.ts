import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideMtcSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				adProduct: 'top_leaderboard',
				group: 'LB',
				sizes: [],
				defaultSizes: [],
				providers: ['nothing'],
			},
		};

		context.set('slots', slots);
		context.push('state.adStack', { id: 'top_leaderboard' });
	}
}
