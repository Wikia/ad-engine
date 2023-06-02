export const desktopSlots = {
	top_leaderboard: {
		adProduct: 'top_leaderboard',
		aboveTheFold: true,
		firstCall: true,
		group: 'LB',
		options: {},
		sizes: [
			{
				viewportSize: [1024, 0],
				sizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
				],
			},
		],
		defaultSizes: [[728, 90]],
		defaultTemplates: [],
		targeting: {
			pos: ['top_leaderboard', 'nav'],
			loc: 'top',
		},
	},
	top_boxad: {
		adProduct: 'top_boxad',
		aboveTheFold: true,
		group: 'MR',
		options: {},
		defaultSizes: [[300, 250]],
		targeting: {
			loc: 'top',
			pos: ['top_boxad', 'top'],
		},
	},
	incontent_boxad: {
		adProduct: 'incontent_boxad_1',
		bidderAlias: 'incontent_boxad_1',
		options: {},
		sizes: [],
		defaultSizes: [[300, 250]],
		targeting: {
			loc: 'middle',
			pos: ['incontent_boxad', 'middle'],
		},
	},
	bottom_leaderboard: {
		adProduct: 'bottom_leaderboard',
		group: 'PF',
		options: {},
		sizes: [
			{
				viewportSize: [1024, 0],
				sizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
				],
			},
		],
		defaultSizes: [[728, 90]],
		targeting: {
			loc: 'footer',
			pos: ['bottom_leaderboard', 'footer'],
		},
	},
};
