export const mobileSlots = {
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
					[320, 100],
					[320, 50],
					[5, 5],
				],
			},
		],
		defaultSizes: [[320, 50]],
		defaultTemplates: [],
		targeting: {
			pos_nr: 'nav',
			pos: ['top_leaderboard', 'nav'],
			loc: 'top',
		},
	},
	incontent_boxad: {
		defaultSizes: [
			[300, 250],
			[320, 50],
			[320, 100],
			[5, 5],
		],
		incremental: true,
		collapseEmptyDiv: [true],
		targeting: {
			pos_nr: 'increment',
			pos: ['incontent_boxad', 'middle'],
			loc: 'middle',
		},
	},
	bottom_leaderboard: {
		defaultSizes: [
			[320, 50],
			[300, 250],
			[5, 5],
		],
		incremental: true,
		collapseEmptyDiv: [true],
		targeting: {
			pos_nr: 'bottom',
			pos: ['bottom_leaderboard', 'bottom'],
			loc: 'bottom',
		},
	},
};
