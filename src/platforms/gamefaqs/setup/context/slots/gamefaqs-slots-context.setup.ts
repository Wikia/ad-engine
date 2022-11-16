import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamefaqsSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				code: 'interstitial',
				sizes: [[1, 1]],
				outOfPage: true,
			},
			'interstitial-inc': {
				code: 'interstitial-inc',
				sizes: [[1, 1]],
				incremental: true,
				outOfPage: true,
			},
			'skybox-nav': {
				code: 'skybox-nav',
				sizes: [[5, 5]],
				targeting: {
					pos: 'nav',
				},
			},
			mpu_top: {
				code: 'mpu_top',
				sizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: 'top',
				},
			},
			mpu_plus_top: {
				code: 'mpu_plus_top',
				sizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					pos: 'top',
				},
			},
			mpu_middle: {
				code: 'mpu_middle',
				sizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			mpu_bottom: {
				code: 'mpu_bottom',
				sizes: [[300, 250]],
				incremental: true,
				allowedTypes: {
					banner: true,
					native: false,
					video: false,
				},
				targeting: {
					pos: 'bottom',
				},
			},
			leader_plus_top: {
				code: 'leader_plus_top',
				sizes: [
					[728, 90],
					[970, 250],
					[970, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			leader_top: {
				code: 'leader_top',
				sizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			leader_bottom: {
				code: 'leader_bottom',
				sizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			overlay_leader_top: {
				code: 'overlay_leader_top',
				sizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			overlay_mpu_top: {
				code: 'overlay_mpu_top',
				sizes: [[300, 250]],
				targeting: {
					pos: 'top',
				},
			},
			leader_middle: {
				code: 'leader_middle',
				sizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'sky-leader-plus-top': {
				code: 'sky-leader-plus-top',
				sizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'incontent-ad': {
				code: 'incontent-ad',
				sizes: [[728, 90], [970, 66], [5, 5], [11, 11], 'fluid'],
				targeting: {
					pos: 'top',
				},
			},
			'incontent-ad-inc': {
				code: 'incontent-ad-inc',
				sizes: [[728, 90], [970, 66], [5, 5], [11, 11], 'fluid'],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'leader-plus-inc': {
				code: 'leader-plus-inc',
				sizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[970, 90],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mpu-top-inc': {
				code: 'mpu-top-inc',
				sizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mpu-bottom-inc': {
				code: 'mpu-bottom-inc',
				sizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'leader-bottom-inc': {
				code: 'leader-bottom-inc',
				sizes: [
					[728, 90],
					[970, 66],
				],

				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			logo_top: {
				code: 'logo_top',
				sizes: [[160, 70]],
				targeting: {
					pos: 'top',
				},
			},
			'native-top': {
				code: 'native-top',
				sizes: [[11, 11], 'fluid'],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-skybox-nav': {
				code: 'mobile-skybox-nav',
				sizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-native': {
				code: 'mobile-native',
				sizes: [[300, 250], [11, 11], 'fluid'],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-incontent-ad': {
				code: 'mobile-incontent-ad',
				sizes: [[300, 250], [320, 50], [11, 11], 'fluid', [5, 5]],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-banner-bottom': {
				code: 'mobile-banner-bottom',
				sizes: [[320, 50]],
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-mpu-bottom': {
				code: 'mobile-mpu-bottom',
				sizes: [[300, 250]],
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				code: 'mobile-native-plus-top',
				sizes: [[300, 250], [11, 11], 'fluid'],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-flex-bottom': {
				code: 'mobile-flex-bottom',
				sizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-autoplay-plus': {
				code: 'mobile-autoplay-plus',
				sizes: [[300, 250], [320, 50], 'fluid', [11, 11], [5, 5]],
				targeting: {
					pos: 'plus',
				},
			},
			'mobile-highimpact-plus': {
				code: 'mobile-highimpact-plus',
				sizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					pos: 'plus',
				},
			},
			'incontent-mobile-flex': {
				code: 'incontent-mobile-flex',
				sizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-banner': {
				code: 'mobile-banner',
				sizes: [[320, 50]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-mpu': {
				code: 'mobile-mpu',
				sizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-incontent-ad-inc': {
				code: 'mobile-incontent-ad-inc',
				sizes: [[300, 250], [320, 50], [11, 11], 'fluid', [5, 5]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-flex-inc': {
				code: 'mobile-flex-inc',
				sizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-logo': {
				code: 'mobile-logo',
				sizes: [[160, 70]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-nav-ad-plus-banner': {
				code: 'mobile-nav-ad-plus-banner',
				sizes: [
					[5, 5],
					[320, 50],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'leader-ad-plus-top': {
				code: 'leader-ad-plus-top',
				sizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					pos: 'top',
				},
			},
			'leader-ad-plus-middle': {
				code: 'leader-ad-plus-middle',
				sizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				incremental: true,
				targeting: {
					pos: 'middle',
				},
			},
			'native-mpu': {
				code: 'native-mpu',
				sizes: [[300, 250], 'fluid'],
				incremental: true,
				targeting: {
					pos: 'native',
				},
			},
			'incontent-ad-plus-billboard-bottom': {
				code: 'incontent-ad-plus-billboard-bottom',
				sizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-incontent-plus': {
				code: 'mobile-incontent-plus',
				sizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'increment',
				},
			},
			'mobile-incontent-plus-bottom': {
				code: 'mobile-incontent-plus-bottom',
				sizes: [
					[320, 50],
					[300, 250],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'nav-ad-plus-leader': {
				code: 'nav-ad-plus-leader',
				sizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-banner-plus': {
				code: 'mobile-banner-plus',
				sizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos: 'increment',
				},
			},
			'incontent-ad-plus-inc': {
				code: 'incontent-ad-plus-inc',
				sizes: [[728, 90], [970, 66], [5, 5], 'fluid'],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-incontent-ad-plus-inc': {
				code: 'mobile-incontent-ad-plus-inc',
				sizes: [[5, 5], [320, 50], [300, 250], 'fluid'],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-all-top': {
				code: 'incontent-all-top',
				sizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-incontent-all': {
				code: 'mobile-incontent-all',
				sizes: [
					[300, 250],
					[5, 5],
					[320, 480],
					[8, 8],
				],
				incremental: true,
				allowedTypes: {
					banner: true,
					native: false,
					video: false,
				},
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'increment',
				},
			},
			'incontent-narrow-all-top': {
				code: 'incontent-narrow-all-top',
				sizes: [
					[728, 90],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'top',
				},
			},
			'video-rectangle': {
				code: 'video-rectangle',
				sizes: [[640, 480]],
				lazyLoad: false,
				incremental: false,
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
