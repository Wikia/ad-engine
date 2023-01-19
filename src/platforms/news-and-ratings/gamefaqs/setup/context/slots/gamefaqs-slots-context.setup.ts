import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamefaqsSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				code: 'interstitial',
				defaultSizes: [[1, 1]],
				outOfPage: true,
			},
			'omni-skybox-nav': {
				code: 'omni-skybox-nav',
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'skybox-nav': {
				code: 'skybox-nav',
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'native-top': {
				code: 'native-top',
				defaultSizes: [
					// 'fluid',
					[11, 11],
				],
				targeting: {
					pos: 'top',
				},
			},
			'incontent-ad': {
				code: 'incontent-ad',
				defaultSizes: [
					[728, 90],
					[970, 66],
					// 'fluid',
					[5, 5],
				],
				targeting: {
					pos: 'top',
				},
			},
			leader_plus_top: {
				code: 'leader_plus_top',
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			leader_top: {
				code: 'leader_top',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos: 'top',
				},
			},
			mpu_top: {
				code: 'mpu_top',
				defaultSizes: [[300, 250]],
				targeting: {
					pos: 'top',
				},
			},
			mpu_plus_top: {
				code: 'mpu_plus_top',
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					pos: 'top',
				},
			},
			mpu_bottom: {
				code: 'mpu_bottom',
				defaultSizes: [[300, 250]],
				lazyLoad: true,
				targeting: {
					pos: 'bottom',
				},
			},
			leader_bottom: {
				code: 'leader_bottom',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				lazyLoad: true,
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-omni-skybox-nav': {
				code: 'mobile-omni-skybox-nav',
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-skybox-nav': {
				code: 'mobile-skybox-nav',
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-native-top': {
				code: 'mobile-native-top',
				defaultSizes: [
					[300, 250],
					[320, 50],
					// 'fluid',
					[11, 11],
				],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-incontent-ad': {
				code: 'mobile-incontent-ad',
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
					// 'fluid'
				],
				targeting: {
					pos: 'incontent',
				},
			},
			'mobile-mpu-banner-bottom': {
				code: 'mobile-mpu-banner-bottom',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				code: 'mobile-native-plus-top',
				defaultSizes: [
					[300, 250],
					[320, 50],
					// 'fluid',
					[11, 11],
				],
				targeting: {
					pos: 'top',
				},
			},
			'mobile-highimpact-plus': {
				code: 'mobile-highimpact-plus',
				defaultSizes: [
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
				defaultSizes: [
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
				defaultSizes: [[320, 50]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'mobile-mpu': {
				code: 'mobile-mpu',
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos: '1',
				},
			},
			'nav-ad-plus': {
				code: 'nav-ad-plus',
				defaultSizes: [
					[5, 5],
					[970, 66],
					[728, 90],
				],
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-nav-ad-plus': {
				code: 'mobile-nav-ad-plus',
				defaultSizes: [
					[5, 5],
					[320, 50],
				],
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'nav',
				},
			},
			'mobile-banner-plus-inc': {
				code: 'mobile-banner-plus-inc',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				collapseEmptyDiv: [true],
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-incontent-ad-plus': {
				code: 'mobile-incontent-ad-plus',
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'mobile-banner-mpu': {
				code: 'mobile-banner-mpu',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-ad-plus': {
				code: 'incontent-ad-plus',
				defaultSizes: [
					[970, 66],
					[728, 90],
					[5, 5],
				],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			'incontent-leader-middle': {
				code: 'incontent-leader-middle',
				defaultSizes: [
					[970, 66],
					[728, 90],
				],
				lazyLoad: true,
				incremental: true,
				targeting: {
					pos: 'inc',
				},
			},
			video: {
				targeting: {
					rv: 1,
				},
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
