import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class GamespotSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				defaultSizes: [[1, 1]],
				outOfPage: true,
			},
			'interstitial-inc': {
				defaultSizes: [[1, 1]],
				outOfPage: true,
			},
			'skybox-nav': {
				defaultSizes: [[5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
				targeting: {
					loc: 'top',
					pos_nr: 'nav',
				},
			},
			mpu_top: {
				defaultSizes: [[300, 250]],
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
			mpu_middle: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: '1',
				},
			},
			mpu_bottom: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			leader_bottom: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			overlay_leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			overlay_mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'top',
				},
			},
			leader_middle: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'sky-leader-plus-top': {
				defaultSizes: [
					[970, 250],
					[970, 66],
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'incontent-ad': {
				defaultSizes: [
					[970, 66],
					[728, 90],
					[11, 11],
					[5, 5],
					// fluid?
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-ad-inc': {
				defaultSizes: [
					[970, 66],
					[728, 90],
					[11, 11],
					[5, 5],
					// fluid?
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'leader-plus-inc': {
				defaultSizes: [
					[970, 250],
					[970, 90],
					[970, 66],
					[728, 90],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'mpu-top-inc': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: '1',
				},
			},
			'mpu-bottom-inc': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: '1',
				},
			},
			'leader-bottom-inc': {
				defaultSizes: [
					[970, 66],
					[728, 90],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			logo_top: {
				defaultSizes: [[160, 70]],
				targeting: {
					pos_nr: 'top',
				},
			},
			'native-top': {
				defaultSizes: [
					[11, 11],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-skybox-nav': {
				defaultSizes: [[6, 6], [5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
				targeting: {
					loc: 'top',
					pos_nr: 'nav',
				},
			},
			'mobile-native': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-incontent-ad': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[11, 11],
					[5, 5],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-banner-bottom': {
				defaultSizes: [[320, 50]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-mpu-bottom': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// fluid
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-flex-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-autoplay-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[11, 11],
					[5, 5],
					// fluid
				],
				targeting: {
					pos_nr: 'plus',
				},
			},
			'mobile-highimpact-plus': {
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
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-banner': {
				defaultSizes: [[320, 50]],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-mpu': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-incontent-ad-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[11, 11],
					[5, 5],
					// fluid
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-flex-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-logo': {
				defaultSizes: [[160, 70]],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[320, 50],
					[5, 5],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'leader-ad-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'leader-ad-plus-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'native-mpu': {
				defaultSizes: [
					[300, 250],
					// fluid
				],
				targeting: {
					pos_nr: 'native',
				},
			},
			'incontent-ad-plus-billboard-bottom': {
				defaultSizes: [
					[970, 250],
					[970, 66],
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-incontent-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
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
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'nav-ad-plus-leader': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'mobile-banner-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'increment',
				},
			},
			'incontent-ad-plus-inc': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
					// fluid
				],
				targeting: {
					pos_nr: 'inc',
				},
			},
			'mobile-incontent-ad-plus-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
					// fluid
				],
				targeting: {
					pos_nr: 'inc',
				},
			},
			'incontent-all-top': {
				defaultSizes: [
					[970, 250],
					[970, 66],
					[728, 90],
					[8, 8],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-incontent-all': {
				defaultSizes: [
					[320, 480],
					[300, 250],
					[8, 8],
					[5, 5],
				],
				targeting: {
					pos_nr: 'increment',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[8, 8],
					[5, 5],
				],
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
