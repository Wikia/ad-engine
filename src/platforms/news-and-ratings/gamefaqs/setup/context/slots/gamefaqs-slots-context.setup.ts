import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GamefaqsSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				adProduct: 'interstitial',
				adUnit:
					'/{custom.dfpId}/{slotConfig.group}/{slotConfig.adProduct}' +
					'/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
				group: 'IU',
				outOfPage: true,
				outOfPageFormat: 'INTERSTITIAL',
				targeting: {
					loc: 'hivi',
				},
			},
			top_leaderboard: {
				firstCall: true,
				adProduct: 'top_leaderboard',
				group: 'LB',
				sizes: [
					{
						viewportSize: [970, 200],
						sizes: [[728, 90], [970, 250], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
					},
					{
						viewportSize: [320, 200],
						sizes: [[320, 50], [320, 100], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
					},
					{
						viewportSize: [0, 0],
						sizes: [[320, 50]],
					},
				],
				defaultSizes: [
					[728, 90],
					[970, 250],
				],
				defaultTemplates: [],
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
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-banner': {
				code: 'mobile-banner',
				defaultSizes: [[320, 50]],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-mpu': {
				code: 'mobile-mpu',
				defaultSizes: [[300, 250]],
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
				targeting: {
					pos_nr: 'inc',
				},
			},
			video: {
				isVideo: true,
			},
			floor_adhesion: {
				disabled: true,
				adProduct: 'floor_adhesion',
				group: 'PF',
				targeting: {
					loc: 'footer',
				},
				defaultTemplates: ['floorAdhesion'],
				defaultSizes: [[728, 90]],
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [
							[300, 50],
							[320, 50],
							[320, 100],
						],
					},
					{
						// 728px for the ad + 40px width of the close button
						viewportSize: [768, 0],
						sizes: [
							[300, 50],
							[320, 50],
							[320, 100],
							[728, 90],
						],
					},
				],
			},
		};

		context.set('slots', slots);
	}
}
