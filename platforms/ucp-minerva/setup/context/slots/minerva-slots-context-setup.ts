import { SlotsContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MinervaSlotsContextSetup implements SlotsContextSetup {
	constructor() {}

	configureSlotsContext(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				adProduct: 'top_leaderboard',
				bidderAlias: '01_LB',
				slotNameSuffix: '',
				defaultSizes: [
					[728, 90],
					[970, 150],
					[970, 250],
				],
				firstCall: true,
				group: 'LB',
				insertBeforeSelector: '#content > div',
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
				adProduct: 'top_boxad',
				aboveTheFold: true,
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				bidderAlias: '02_MR',
				insertBeforeSelector: '#mw-content-text h2:nth-child(2)',
				group: 'MR',
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			footer: {
				adProduct: 'footer',
				aboveTheFold: false,
				defaultSizes: [[300, 250]],
				group: 'PF',
				bidderAlias: '03_PF',
				insertAfterSelector: '.minerva-footer .license',
				targeting: {
					loc: 'footer',
					zne: '03',
					rv: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
