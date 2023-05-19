import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class GiantbombSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			interstitial: {
				adProduct: 'interstitial',
				adUnit:
					'/{custom.dfpId}/{slotConfig.group}/{slotConfig.adProduct}' +
					'/{custom.device}{custom.region}-{custom.property}{custom.pagePath}',
				group: 'IU',
				options: {},
				outOfPage: true,
				outOfPageFormat: 'INTERSTITIAL',
				targeting: {
					loc: 'hivi',
				},
			},
			'skybox-nav': {
				defaultSizes: [[5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
				targeting: {
					pos_nr: 'nav',
					loc: 'top',
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
			logo_top: {
				defaultSizes: [[160, 70]],
				targeting: {
					pos_nr: 'top',
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
					// fluid
				],
				targeting: {
					pos_nr: 'top',
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
					pos_nr: 'top',
				},
			},
			'mobile-skybox-nav': {
				defaultSizes: [[5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
				targeting: {
					pos_nr: 'nav',
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
			'mobile-banner-plus': {
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
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
			video: {
				isVideo: true,
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				group: 'PF',
				options: {},
				targeting: {
					loc: 'footer',
				},
				defaultTemplates: ['floorAdhesion'],
				defaultSizes: [[728, 90]],
			},
		};

		context.set('slots', slots);
	}
}
