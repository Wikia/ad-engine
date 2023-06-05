export function getYahooSspContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			pubId: ['8a969450018585a63429a7e4ff400130'],
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			pubId: ['8a969450018585a63429a7e505390132', '8a969dc9018585a62bdba7e50025010f'],
		},
		top_boxad: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e5021b0131'],
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			pubId: ['8a969450018585a63429a7e51e7e013a'],
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			pubId: ['8a969450018585a63429a7e51b710139'],
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			pubId: ['8a9691e7018585a630eba7e504170106', '8a969dc9018585a62bdba7e51faf0119'],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			pubId: ['8a969450018585a63429a7e5227f013b', '8a969450018585a63429a7e51e7e013a'],
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
