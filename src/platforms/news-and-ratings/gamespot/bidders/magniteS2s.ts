export function getMagniteS2sContext(isDesktop: boolean): object {
	const desktopSlots = {
		'gamespot_dt_ic-lb': {
			sizes: [
				[728, 90],
				[970, 250],
				[970, 66],
			],
		},
		'gamespot_dt_bottom-lb': {
			sizes: [
				[728, 90],
				[970, 250],
				[970, 66],
			],
		},
		'gamespot_dt_ic-boxad': {
			sizes: [
				[300, 250],
				[300, 600],
				[160, 600],
			],
		},
		gamespot_dt_top_boxad: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
	};

	const mobileSlots = {
		gamespot_adhesion_mw: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		gamespot_mw_bottom_lb: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		'gamespot_mw_ic-boxad': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		'gamespot_mw_ic-lb': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		gamespot_mw_top_boxad: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
