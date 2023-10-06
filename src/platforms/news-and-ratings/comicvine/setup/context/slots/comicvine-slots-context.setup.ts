import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class ComicvineSlotsContextSetup implements DiProcess {
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
				bidderAlias: 'comicvine_dt_728x90_1',
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
				defaultTemplates: ['stickyTlb'],
				targeting: {
					loc: 'top',
					pos_nr: 'nav',
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				bidderAlias: 'comicvine_dt_728x90_2',
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
						sizes: [[728, 90]],
					},
				],
			},
			leader_plus_top: {
				bidderAlias: 'comicvine_dt_728x90_3',
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
				bidderAlias: 'comicvine_dt_728x90_4',
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
				bidderAlias: 'comicvine_dt_728x90_5',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_top: {
				bidderAlias: 'comicvine_dt_300x250_1',
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'top',
				},
			},
			mpu_bottom: {
				bidderAlias: 'comicvine_dt_300x250_2',
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			leader_bottom: {
				bidderAlias: 'comicvine_dt_728x90_5',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			overlay_leader_top: {
				bidderAlias: 'comicvine_dt_728x90_5',
				defaultSizes: [
					[728, 90],
					[970, 66],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			overlay_mpu_top: {
				bidderAlias: 'comicvine_dt_300x250_3',
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
			'mobile-native': {
				bidderAlias: 'comicvine_mw_300x250_1',
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
				bidderAlias: 'comicvine_mw_300x250_2',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-native-plus-top': {
				bidderAlias: 'comicvine_mw_300x250_3',
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
				bidderAlias: 'comicvine_mw_300x250_4',
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
				bidderAlias: 'comicvine_mw_300x250_4',
				defaultSizes: [
					[300, 250],
					[320, 50],
				],
				targeting: {
					pos_nr: '1',
				},
			},
			'mobile-banner': {
				bidderAlias: 'comicvine_mw_320x50_1',
				defaultSizes: [[320, 50]],
				targeting: {
					pos_nr: '1',
				},
			},
			video: {
				isVideo: true,
			},
			incontent_player: {
				adProduct: 'incontent_player',
				disabled: true,
				isVideo: true,
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
				},
			},
		};

		context.set('slots', slots);
	}
}
