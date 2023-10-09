export function getSeedtagContext(isDesktop: boolean): object {
	const desktopSlots = {
		// 'top_leaderboard': {
		//     sizes: [[728, 90]],
		//     ids: ['4857013'],
		// },
		'incontent-leader-plus-inc': {
			sizes: [
				[728, 90],
				[970, 250],
			],
			adUnitId: ['29835702', '29835702'],
			publisherId: '1502-5443-01',
			placement: 'inBanner',
			customCodes: ['tvguidegalleries_dt_728x90_22', 'tvguidegalleries_dt_970x250_4'],
		},
	};

	const mobileSlots = {
		// 'mobile-omni-skybox-plus-sticky': {
		//     sizes: [[320, 50]],
		//     ids: ['4857050'],
		// },
	};

	return {
		enabled: false,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
