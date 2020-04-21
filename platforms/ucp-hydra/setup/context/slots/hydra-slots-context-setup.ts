import { SlotsContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class HydraSlotsContextSetup implements SlotsContextSetup {
	constructor() {}

	configureSlotsContext(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				defaultSizes: [
					[728, 90],
					[970, 150],
					[970, 250],
				],
				firstCall: true,
				group: 'LB',
				insertBeforeSelector: '#firstHeading',
				sizes: [
					{
						viewportSize: [1024, 300],
						sizes: [
							[728, 90],
							[970, 150],
							[970, 250],
							[980, 150],
							[980, 250],
						],
					},
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 150],
							[970, 250],
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [0, 0],
						sizes: [
							[320, 50],
							[320, 100],
						],
						mobileViewport: true,
					},
				],
				targeting: {
					loc: 'top',
					zne: '01',
					rv: 1,
					xna: 1,
				},
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				defaultSizes: [[728, 90]],
				group: 'PF',
				insertAfterSelector: '#bodyContent',
				sizes: [],
				targeting: {
					loc: 'middle',
					zne: '04',
					rv: 1,
					xna: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
