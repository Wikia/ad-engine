export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			ids: ['4856964'],
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856970', '4856965'],
		},
		top_boxad: {
			sizes: [[300, 250]],
			ids: ['4856967'],
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			ids: ['4856980'],
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			ids: ['4856977'],
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856969', '4856981'],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			ids: ['4856983', '4856980'],
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
