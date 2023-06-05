export function getIndexExchangeContext(isDesktop: boolean): object {
	const desktopSlots = {
		top_leaderboard: {
			sizes: [[728, 90]],
			siteId: ['936309'],
		},
		bottom_leaderboard: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			siteId: ['936315', '936310'],
		},
		top_boxad: {
			sizes: [[300, 250]],
			siteId: ['936312'],
		},
		incontent_boxad: {
			sizes: [[300, 250]],
			siteId: ['936325'],
		},
		video: {
			siteId: '936594',
		},
	};

	const mobileSlots = {
		top_leaderboard: {
			sizes: [[320, 50]],
			siteId: ['936322'],
		},
		incontent_boxad: {
			sizes: [
				[300, 250],
				[320, 50],
			],
			siteId: ['936314', '936326'],
		},
		bottom_leaderboard: {
			sizes: [
				[320, 50],
				[300, 250],
			],
			siteId: ['936328', '936325'],
		},
		video: {
			siteId: '936611',
		},
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
