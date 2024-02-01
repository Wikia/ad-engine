export function getMagniteS2sContext(isDesktop: boolean): object {
	const desktopSlots = {
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
		},
		leader_bottom: {
			sizes: [[728, 90]],
		},
	};

	const mobileSlots = {
		'mobile-banner-bottom': {
			sizes: [
				[320, 50],
				[320, 100],
			],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
		},
	};

	return {
		enabled: false,
		accountId: 7450,
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
