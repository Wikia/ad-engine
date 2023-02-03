import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TestPageSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				parentContainerSelector: '.top-leaderboard',
				options: {},
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [
							[728, 90],
							[970, 66],
							[970, 90],
							[970, 150],
							[970, 180],
							[970, 250],
							[970, 365],
							[1024, 416],
							[1030, 65],
							[1030, 130],
							[1030, 250],
						],
					},
				],
				defaultSizes: [[728, 90]],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					pos: ['top_leaderboard', 'hivi_leaderboard'],
					rv: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
