import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
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
					sl: '',
					pos: 'nav',
					loc: 'top',
				},
			},
			mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			mpu_plus_top: {
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			mpu_middle: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			mpu_bottom: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'bottom',
				},
			},
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			leader_bottom: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					sl: '',
					pos: 'bottom',
				},
			},
			overlay_leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			overlay_mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			leader_middle: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					sl: '',
					pos: '1',
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
					sl: '',
					pos: '1',
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
					sl: '',
					pos: 'top',
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
					sl: '',
					pos: '1',
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
					sl: '',
					pos: '1',
				},
			},
			'mpu-top-inc': {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'mpu-bottom-inc': {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'leader-bottom-inc': {
				defaultSizes: [
					[970, 66],
					[728, 90],
				],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			logo_top: {
				defaultSizes: [[160, 70]],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			'native-top': {
				defaultSizes: [
					[11, 11],
					// fluid
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			'mobile-skybox-nav': {
				defaultSizes: [[6, 6], [5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
				targeting: {
					sl: '',
					pos: 'nav',
					loc: 'top',
				},
			},
			'mobile-native': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// fluid
				],
				targeting: {
					sl: '',
					pos: 'top',
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
					sl: '',
					pos: 'top',
				},
			},
			'mobile-banner-bottom': {
				defaultSizes: [[320, 50]],
				targeting: {
					sl: '',
					pos: 'bottom',
				},
			},
			'mobile-mpu-bottom': {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// fluid
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			'mobile-flex-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					sl: '',
					pos: 'bottom',
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
					sl: '',
					pos: 'plus',
				},
			},
			'mobile-highimpact-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'plus',
				},
			},
			'incontent-mobile-flex': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'mobile-banner': {
				defaultSizes: [[320, 50]],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'mobile-mpu': {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: '1',
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
					sl: '',
					pos: '1',
				},
			},
			'mobile-flex-inc': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'mobile-logo': {
				defaultSizes: [[160, 70]],
				targeting: {
					sl: '',
					pos: '1',
				},
			},
			'mobile-nav-ad-plus-banner': {
				defaultSizes: [
					[320, 50],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'nav',
				},
			},
			'leader-ad-plus-top': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			'leader-ad-plus-middle': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
				],
				targeting: {
					sl: '',
					pos: 'middle',
				},
			},
			'native-mpu': {
				defaultSizes: [
					[300, 250],
					// fluid
				],
				targeting: {
					sl: '',
					pos: 'native',
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
					sl: '',
					pos: 'bottom',
				},
			},
			'mobile-incontent-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'increment',
				},
			},
			'mobile-incontent-plus-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'bottom',
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
					sl: '',
					pos: 'nav',
				},
			},
			'mobile-banner-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					sl: '',
					pos: 'increment',
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
					sl: '',
					pos: 'inc',
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
					sl: '',
					pos: 'inc',
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
					sl: '',
					pos: 'top',
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
					sl: '',
					pos: 'increment',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[8, 8],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'top',
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
