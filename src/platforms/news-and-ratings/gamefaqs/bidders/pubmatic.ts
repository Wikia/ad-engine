export function getPubmaticContext(isDesktop: boolean): object {
	const desktopSlots = {
		'incontent-ad': {
			sizes: [[728, 90]],
			ids: ['4856830'],
		},
		leader_plus_top: {
			sizes: [
				[728, 90],
				[970, 250],
			],
			ids: ['4856831', '4856832'],
		},
		leader_top: {
			sizes: [[728, 90]],
			ids: ['4856833'],
		},
		mpu_top: {
			sizes: [[300, 250]],
			ids: ['4856834'],
		},
		mpu_plus_top: {
			sizes: [
				[300, 250],
				[300, 600],
			],
			ids: ['4856835', '4856836'],
		},
		mpu_bottom: {
			sizes: [[300, 250]],
			ids: ['4856837'],
		},
		leader_bottom: {
			sizes: [[728, 90]],
			ids: ['4856838'],
		},
		'nav-ad-plus': {
			sizes: [[728, 90]],
			ids: ['4856853'],
		},
	};
	const mobileSlots = {
		'mobile-native-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856839', '4856840'],
		},
		'mobile-incontent-ad': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856841', '4856842'],
		},
		'mobile-mpu-banner-bottom': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856843', '4856844'],
		},
		'mobile-native-plus-top': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856845', '4856846'],
		},
		'mobile-highimpact-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856847', '4856848'],
		},
		'incontent-mobile-flex': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856849', '4856850'],
		},
		'mobile-banner': {
			sizes: [[320, 50]],
			ids: ['4856851'],
		},
		'mobile-mpu': {
			sizes: [[300, 250]],
			ids: ['4856852'],
		},
		'mobile-nav-ad-plus': {
			sizes: [[320, 50]],
			ids: ['4856854'],
		},
		'mobile-banner-plus-inc': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856855', '4856856'],
		},
		'mobile-incontent-ad-plus': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856857', '4856858'],
		},
		'mobile-banner-mpu': {
			sizes: [
				[300, 250],
				[320, 50],
			],
			ids: ['4856859', '4856860'],
		},
		'incontent-ad-plus': {
			sizes: [[728, 90]],
			ids: ['4856861'],
		},
	};

	return {
		enabled: false,
		publisherId: '156260',
		slots: isDesktop ? desktopSlots : mobileSlots,
	};
}
