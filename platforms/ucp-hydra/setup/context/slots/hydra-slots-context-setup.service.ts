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
			top_boxad: {
				aboveTheFold: true,
				adProduct: 'top_boxad',
				slotNameSuffix: '',
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				group: 'MR',
				insertBeforeSelector: '',
				sizes: [],
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				defaultSizes: [[728, 90]],
				group: 'PF',
				insertAfterSelector: '#catlinks',
				sizes: [],
				targeting: {
					loc: 'middle',
					zne: '04',
					rv: 1,
					xna: 1,
				},
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'incontent_boxad_1',
				defaultSizes: [[300, 250]],
				group: 'HiVi',
				insertBeforeSelector: '',
				sizes: [],
				targeting: {
					loc: 'footer',
					zne: '06',
					rv: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
