export function getMagniteS2sContext(isDesktop: boolean): object {
	const desktopSlots = {
		comicvine_dt_728x90_1: {
			sizes: [[728, 90]],
		},
		comicvine_dt_970x250_1: {
			sizes: [[970, 250]],
		},
		comicvine_dt_728x90_2: {
			sizes: [[728, 90]],
		},
		comicvine_dt_970x250_2: {
			sizes: [[970, 250]],
		},
		comicvine_dt_728x90_3: {
			sizes: [[728, 90]],
		},
		comicvine_dt_300x250_1: {
			sizes: [[300, 250]],
		},
		comicvine_dt_300x250_2: {
			sizes: [[300, 250]],
		},
		comicvine_dt_728x90_4: {
			sizes: [[728, 90]],
		},
		comicvine_dt_728x90_5: {
			sizes: [[728, 90]],
		},
		comicvine_dt_300x250_3: {
			sizes: [[300, 250]],
		},
	};

	const mobileSlots = {
		comicvine_mw_300x250_1: {
			sizes: [[300, 250]],
		},
		comicvine_mw_300x250_2: {
			sizes: [[300, 250]],
		},
		comicvine_mw_320x50_1: {
			sizes: [[320, 50]],
		},
		comicvine_mw_300x250_3: {
			sizes: [[300, 250]],
		},
		comicvine_mw_300x250_4: {
			sizes: [[300, 250]],
		},
		comicvine_mw_320x50_2: {
			sizes: [[320, 50]],
		},
		comicvine_mw_300x250_5: {
			sizes: [[300, 250]],
		},
		comicvine_mw_320x50_3: {
			sizes: [[320, 50]],
		},
		comicvine_mw_320x50_4: {
			sizes: [[320, 50]],
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
