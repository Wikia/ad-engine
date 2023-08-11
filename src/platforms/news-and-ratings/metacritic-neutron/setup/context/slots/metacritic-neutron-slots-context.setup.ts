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
						sizes: [[728, 90], [970, 66], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
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
			'incontent-leader-plus-bottom': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[970, 250],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'incontent-leaderboard-bottom': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mpu-plus-top': {
				defaultSizes: [
					[300, 250],
					[320, 600],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-top': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'top',
				},
			},
			'mpu-middle': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'mpu-bottom': {
				defaultSizes: [[300, 250]],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'mobile-banner-plus': {
				defaultSizes: [
					[320, 50],
					[300, 250],
				],
				targeting: {
					pos_nr: 'increment',
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
					[320, 50],
					[300, 250],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
			'leaderboard-middle': {
				defaultSizes: [[728, 90]],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leader-plus-top': {
				defaultSizes: [
					[970, 66],
					[970, 250],
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
				},
			},
			'incontent-leaderboard-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
				],
				targeting: {
					pos_nr: 'top',
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
				targeting: {
					pos_nr: 'top',
				},
			},
			'nav-ad-plus-leader': {
				defaultSizes: [
					[728, 90],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'nav',
				},
			},
			'incontent-ad-plus-billboard-middle': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-leaderboard-middle': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			'incontent-narrow-all-top': {
				defaultSizes: [
					[728, 90],
					[5, 5],
					[8, 8],
				],
				targeting: {
					pos_nr: 'top',
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
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-all': {
				defaultSizes: [
					[300, 250],
					[5, 5],
					[320, 480],
					[8, 8],
				],
				targeting: {
					pos_nr: 'increment',
				},
			},
			'mobile-incontent-ad-plus': {
				defaultSizes: [
					[300, 250],
					[5, 5],
				],
				targeting: {
					pos_nr: 'increment',
				},
			},
			video: {
				isVideo: true,
			},
			'incontent-leader-plus-middle': {
				defaultSizes: [
					[728, 90],
					[970, 250],
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			incontent_leaderboard: {
				sizes: [
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 66],
							[5, 5],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90], [5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
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
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'middle',
				},
			},
			bottom_leaderboard: {
				sizes: [
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 66],
							[5, 5],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90], [5, 5], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
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
					[970, 66],
					[5, 5],
				],
				targeting: {
					pos_nr: 'bottom',
				},
			},
		};

		context.set('slots', slots);
	}
}
