import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class MetacriticSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			nav_ad_omni: {
				defaultSizes: [[5, 5], [6, 6], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
				targeting: {
					pos_nr: 'nav',
					loc: 'top',
				},
			},
			leader_plus_top: {
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
				defaultSizes: [
					[728, 90],
					[970, 66],
					[728, 91],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			native_top: {
				defaultSizes: [
					[11, 11],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_plus_top: {
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_bottom: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			leader_bottom: {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			recirculation_ad: {
				defaultSizes: [[300, 249]],
				targeting: {
					pos_nr: 'recirculation',
				},
			},
			leader_middle: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[728, 93],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			leader_middle2: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[728, 93],
				],
				targeting: {
					pos_nr: 'middle2',
				},
			},
			incontent_plus_top: {
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
			mobile_nav_ad_omni: {
				defaultSizes: [
					[5, 5],
					[6, 6],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			mobile_banner_top: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mobile_native_top: {
				defaultSizes: [
					[11, 11],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mobile_incontent_plus_top: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mobile_banner_plus_middle: {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_incontent_plus_middle2: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle2',
				},
			},
			mobile_mpu_banner_bottom: {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			mobile_gallery_banner_plus_1: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_2: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_3: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_4: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_5: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_6: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_7: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_8: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_9: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_10: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_11: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_12: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			mobile_gallery_banner_plus_13: {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[320, 480],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [[5, 5], [320, 50], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
				targeting: {
					pos_nr: 'nav',
					loc: 'top',
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
