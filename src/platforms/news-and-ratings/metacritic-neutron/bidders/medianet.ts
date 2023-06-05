export function getMedianetContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			crid: ['735481387'],
			cid: '8CU5JOKX4',
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			crid: ['735481387', '142384784'],
			cid: '8CU5JOKX4',
		},
		top_boxad: {
			sizes: [[300, 250]],
			crid: ['433823587'],
			cid: '8CU5JOKX4',
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			crid: ['134715738'],
			cid: '8CU5JOKX4',
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			crid: ['278522313'],
			cid: '8CU5JOKX4',
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			crid: ['433823587', '278522313'],
			cid: '8CU5JOKX4',
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			crid: ['278522313', '134715738'],
			cid: '8CU5JOKX4',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
