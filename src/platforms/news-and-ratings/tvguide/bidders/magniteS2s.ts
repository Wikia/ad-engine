export function getMagniteS2sContext(isDesktop: boolean): object {
	const desktopSlots = {
		'tvguide_dt_ic-lb': {
			sizes: [
				[728, 90],
				[970, 250],
				[970, 66],
			],
		},
		'tvguide_dt_bottom-lb': {
			sizes: [
				[728, 90],
				[970, 250],
				[970, 66],
			],
		},
		'tvguide_dt_ic-boxad': {
			sizes: [
				[300, 250],
				[300, 600],
				[160, 600],
			],
		},
		tvguide_dt_top_boxad: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
	};

	const mobileSlots = {
		tvguide_adhesion_mw: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		tvguide_mw_bottom_lb: {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		'tvguide_mw_ic-boxad': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		'tvguide_mw_ic-lb': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		tvguide_mw_top_boxad: {
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
