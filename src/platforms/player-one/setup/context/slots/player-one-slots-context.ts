import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class PlayerOneSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			leader_plus_top: {
				aboveTheFold: true,
				defaultSizes: [[728, 90]],
				firstCall: true,
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [
							[728, 90],
							[970, 66],
							[970, 250],
						],
					},
				],
				targeting: {
					pos: 'top_leaderboard',
				},
				options: {},
			},
		};

		context.set('slots', slots);
	}
}
