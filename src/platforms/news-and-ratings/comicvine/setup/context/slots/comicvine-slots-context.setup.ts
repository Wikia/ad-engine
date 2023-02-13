import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

@injectable()
export class ComicvineSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
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
			leader_plus_top: {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[970, 90],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'sky-leader-plus-top': {
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
			leader_top: {
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_top: {
				defaultSizes: [[300, 250]],
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
			'native-top': {
				defaultSizes: [
					[11, 11],
					// 'fluid'
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
					// 'fluid'
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mobile-mpu-banner-bottom': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				defaultSizes: [
					[300, 250],
					[11, 11],
					// 'fluid'
				],
				targeting: {
					pos_nr: 'top',
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
				incremental: true,
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-banner': {
				defaultSizes: [[320, 50]],
				incremental: true,
				targeting: {
					pos_nr: '1',
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
