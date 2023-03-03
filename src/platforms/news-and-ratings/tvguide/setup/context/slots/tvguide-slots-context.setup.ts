import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'nav-ad-plus': {
				defaultSizes: [[5, 5]],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'omni-skybox-leader-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[970, 66],
					[5, 5],
					universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
				],
				targeting: {
					pos_nr: 'sticky',
					loc: 'top',
				},
			},
			'omni-skybox-leaderboard-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'sticky',
				},
			},
			'omni-skybox-sticky': {
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					pos_nr: 'sticky',
				},
			},
			'omni-leader-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'sticky',
				},
			},
			'omni-leaderboard-sticky': {
				defaultSizes: [
					[6, 6],
					[728, 90],
				],
				targeting: {
					pos_nr: 'sticky',
				},
			},
			'incontent-ad-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-ad-plus-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-ad-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'leader-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'leader-inc': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'leader-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'leader-middle2': {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				incremental: true,
				targeting: {
					pos_nr: 'middle2',
				},
			},
			'leader-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'leader-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'leaderboard-top': {
				defaultSizes: [[728, 90]],
				targeting: {
					pos_nr: 'top',
				},
			},
			'leaderboard-middle': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'leaderboard-middle2': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos_nr: 'middle2',
				},
			},
			'leaderboard-inc': {
				defaultSizes: [[728, 90]],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'leaderboard-bottom': {
				defaultSizes: [[728, 90]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'incontent-leader-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leader-inc': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-leader-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			// as this slot can be repeated many, it uses bidderAlias incontent-leader-plus-inc
			'incontent-leader-plus-inc': {
				bidderAlias: 'incontent-leader-plus-inc',
				defaultClasses: ['hide'],
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'inc',
					loc: 'middle',
				},
				repeat: {
					index: 1,
					limit: 10,
					additionalClasses: ['incontent-leader-plus-inc'],
					slotNamePattern: `{slotConfig.bidderAlias}-{slotConfig.repeat.index}`,
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.pos': '{slotConfig.slotName}',
					},
				},
			},
			'incontent-leader-plus-bottom': {
				bidderAlias: 'incontent-leader-plus-bottom',
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'incontent-leaderboard-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-leaderboard-middle': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leaderboard-inc': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-leaderboard-bottom': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mpu-plus-top': {
				bidderAlias: 'mpu-plus-top',
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-top': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-middle': {
				bidderAlias: 'mpu-middle',
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos_nr: 'middle',
				},
			},
			'mpu-bottom': {
				bidderAlias: 'mpu-bottom',
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'masthead-button-inc': {
				defaultSizes: [[270, 100]],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'mobile-nav-ad-plus': {
				defaultSizes: [
					[7, 7],
					[5, 5],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-omni-skybox-plus-sticky': {
				defaultSizes: [
					[6, 6],
					[320, 50],
					[5, 5],
					universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
				],
				targeting: {
					pos_nr: 'sticky',
					loc: 'top',
				},
			},
			'mobile-omni-plus-sticky': {
				defaultSizes: [
					[6, 6],
					[320, 50],
				],
				targeting: {
					pos_nr: 'sticky',
				},
			},
			'mobile-mpu': {
				defaultSizes: [[300, 250]],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-banner-plus': {
				bidderAlias: 'mobile-banner-plus',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-banner-plus-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'mobile-incontent-plus': {
				bidderAlias: 'mobile-incontent-plus',
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-plus-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-incontent-plus-inc': {
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
			'mobile-masthead-button-inc': {
				defaultSizes: [[270, 100]],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[5, 5],
					[320, 50],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-incontent-mpu-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'incontent-all-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-incontent-all': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-mpu-plus-inc': {
				defaultSizes: [
					[300, 250],
					[5, 5],
				],
				incremental: true,
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
					[8, 8],
				],
				incremental: true,
				targeting: {
					pos_nr: 'top',
				},
			},
			video: {
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
