export function getMagniteS2sContext(isDesktop: boolean): object {
	const desktopSlots = {
		metacritic_dt_top_leaderboard: {
			sizes: [
				[728, 90],
				[970, 66],
			],
		},
		metacritic_bottom_leaderboard_dt: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		metacritic_ic_leaderboard_dt: {
			sizes: [[728, 90]],
		},
		metacritic_dt_floor_adhesion: {
			sizes: [
				[728, 90],
				[320, 50],
				[320, 100],
			],
		},
		metacritic_top_boxad_dt: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
	};

	const mobileSlots = {
		metacritic_adhesion_mw: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		metacritic_bottom_leaderboard_mw: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		metacritic_ic_leaderboard_mw: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		metacritic_mw_floor_adhesion: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		metacritic_mw_top_leaderboard: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		metacritic_top_boxad_mw: {
			sizes: [[320, 250]],
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
