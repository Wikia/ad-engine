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
				// before second header of size h1..h6
				insertBeforeSelector: [1, 2, 3, 4, 5, 6]
					.map((id) => `#bodyContent #mw-content-text .mw-parser-output h${id}:nth-of-type(2)`)
					.join(','),
				group: 'MR',
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				aboveTheFold: false,
				defaultSizes: [[300, 250]],
				bidderAlias: '06_FMR',
				// before fifth header of size h1..h6
				insertBeforeSelector: [1, 2, 3, 4, 5, 6]
					.map((id) => `#bodyContent #mw-content-text .mw-parser-output h${id}:nth-of-type(5)`)
					.join(','),
				group: 'FMR',
				targeting: {
					loc: 'footer',
					zne: '06',
					pos: 'incontent_boxad',
					rv: 1,
				},
			},
			footer_boxad: {
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
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				slotNameSuffix: '',
				group: 'PF',
				options: {},
				slotShortcut: 'b',
				sizes: [],
				disabled: true,
				defaultSizes: [[2, 2]],
				insertAfterSelector: '#bodyContent',
				targeting: {
					loc: 'footer',
					rv: 1,
					xna: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
