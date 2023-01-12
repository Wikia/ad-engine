import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GiantbombSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'skybox-nav': {
				defaultSizes: [[5, 5]],
				targeting: {
					sl: '',
					pos: 'nav',
				},
			},
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 90],
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
			mpu_top: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			mpu_bottom: {
				defaultSizes: [[300, 250]],
				targeting: {
					sl: '',
					pos: 'bottom',
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
			logo_top: {
				defaultSizes: [[160, 70]],
				targeting: {
					sl: '',
					pos: 'top',
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
			interstitial: {
				defaultSizes: [[1, 1]],
				outOfPage: true,
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
			'sky-leader-plus-top': {
				defaultSizes: [
					[970, 250],
					[970, 66],
					[728, 90],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'top',
				},
			},
			'mobile-skybox-nav': {
				defaultSizes: [
					[6, 6],
					[5, 5],
				],
				targeting: {
					sl: '',
					pos: 'nav',
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
			'mobile-mpu-banner-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					sl: '',
					pos: 'bottom',
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
			'mobile-banner-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
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
