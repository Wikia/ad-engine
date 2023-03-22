import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
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
				defaultSizes: [[5, 5]],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'skybox-nav': {
				code: 'skybox-nav',
				defaultSizes: [[5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
				targeting: {
					loc: 'top',
					pos_nr: 'nav',
				},
			},
			'native-top': {
				code: 'native-top',
				defaultSizes: [
					// 'fluid',
					[11, 11],
				],
				targeting: {
					pos_nr: 'top',
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
					pos_nr: 'top',
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
					pos_nr: 'top',
				},
			},
			leader_top: {
				code: 'leader_top',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_top: {
				code: 'mpu_top',
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_plus_top: {
				code: 'mpu_plus_top',
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_bottom: {
				code: 'mpu_bottom',
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			leader_bottom: {
				code: 'leader_bottom',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-omni-skybox-nav': {
				code: 'mobile-omni-skybox-nav',
				defaultSizes: [[5, 5]],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-skybox-nav': {
				code: 'mobile-skybox-nav',
				defaultSizes: [[5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
				targeting: {
					pos_nr: 'nav',
					loc: 'top',
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
					pos_nr: 'top',
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
					pos_nr: 'incontent',
				},
			},
			'mobile-mpu-banner-bottom': {
				code: 'mobile-mpu-banner-bottom',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'bottom',
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
					pos_nr: 'top',
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
					pos_nr: 'plus',
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
					pos_nr: '1',
				},
			},
			'mobile-banner': {
				code: 'mobile-banner',
				defaultSizes: [[320, 50]],
				incremental: true,
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-mpu': {
				code: 'mobile-mpu',
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos_nr: '1',
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
					pos_nr: 'nav',
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
					pos_nr: 'nav',
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
					pos_nr: 'inc',
				},
			},
			'mobile-incontent-ad-plus': {
				code: 'mobile-incontent-ad-plus',
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'mobile-banner-mpu': {
				code: 'mobile-banner-mpu',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-ad-plus': {
				code: 'incontent-ad-plus',
				defaultSizes: [
					[970, 66],
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-leader-middle': {
				code: 'incontent-leader-middle',
				defaultSizes: [
					[970, 66],
					[728, 90],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			video: {
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
