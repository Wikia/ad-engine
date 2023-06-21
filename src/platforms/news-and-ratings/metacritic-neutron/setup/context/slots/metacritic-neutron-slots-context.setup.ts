import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class MetacriticNeutronSlotsContextSetup implements DiProcess {
	// TODO: Refactor - wait for decision on ADEN-12650
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
						sizes: [
							[728, 90],
							[970, 66],
							[970, 250],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
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
						sizes: [[728, 90]],
					},
				],
			},
			top_boxad: {
				adProduct: 'top_boxad',
				bidderAlias: 'mpu-top',
				defaultSizes: [[300, 250]],
				sizes: [
					{
						viewportSize: [840, 200],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [0, 0],
						sizes: [[300, 250]],
					},
				],
				targeting: {
					pos_nr: 'top',
					loc: 'top',
					pos: ['top_boxad', 'top'],
				},
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
				],
				sizes: [
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 66],
							[970, 250],
							[5, 5],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
					},
					{
						viewportSize: [728, 200],
						sizes: [[728, 90], [5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
					},
					{
						viewportSize: [320, 200],
						sizes: [
							[320, 50],
							[300, 250],
							[5, 5],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile,
						],
					},
					{
						viewportSize: [0, 0],
						sizes: [[5, 5]],
					},
				],
				targeting: {
					pos_nr: 'bottom',
					loc: 'footer',
					pos: ['bottom_leaderboard', 'footer'],
				},
			},
			incontent_boxad: {
				adProduct: 'incontent_boxad',
				bidderAlias: 'mpu-middle',
				defaultSizes: [[300, 250]],
				sizes: [
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[5, 5],
						],
					},
					{
						viewportSize: [0, 0],
						sizes: [
							[300, 250],
							[300, 100],
							[300, 50],
							[5, 5],
						],
					},
				],
				targeting: {
					pos_nr: ['middle', 'increment'],
					loc: 'middle',
					pos: ['incontent_boxad', 'middle', 'increment'],
				},
			},
			incontent_leaderboard: {
				adProduct: 'incontent_leaderboard',
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
					[8, 8],
				],
				targeting: {
					pos_nr: 'top',
					loc: 'top',
					pos: ['incontent_leaderboard', 'top'],
				},
			},
			video: {
				isVideo: true,
			},
		};

		context.set('slots', slots);
	}
}
