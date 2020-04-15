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
				defaultSizes: [
					[728, 90],
					[970, 150],
					[970, 250],
				],
				firstCall: true,
				bidderAlias: '01_LB',
				group: '01_LB',
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
				},
			},
			top_boxad: {
				aboveTheFold: true,
				autoplay: true,
				audio: false,
				disableExpandAnimation: true,
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				bidderAlias: '02_MR',
				group: '02_MR',
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			footer: {
				defaultSizes: [[300, 250]],
				group: '03_PF',
				bidderAlias: '03_PF',
				targeting: {
					loc: 'footer',
					zne: '03',
					rv: 1,
				},
			},
			bottom_leaderboard: {
				defaultSizes: [[728, 90]],
				group: '04_BLB',
				bidderAlias: '04_BLB',
				targeting: {
					loc: 'middle',
					zne: '04',
					rv: 1,
				},
			},
			incontent_boxad_1: {
				defaultSizes: [[300, 250]],
				group: '06_FMR',
				bidderAlias: '06_FMR',
				targeting: {
					loc: 'footer',
					zne: '06',
					rv: 1,
				},
			},
			incontent_player: {
				disabled: true,
				autoplay: true,
				audio: false,
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				insertBeforeSelector: '#mw-content-text > .mw-parser-output > h2',
				insertBelowFirstViewport: true,
				targeting: {
					loc: 'middle',
					rv: 1,
				},
			},
		};

		context.set('slots', slots);
	}
}
