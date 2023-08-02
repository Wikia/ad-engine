import { slotsContext } from '@platforms/shared';
import { context, DiProcess, HIDDEN_AD_CLASS, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2SlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				group: 'LB',
				firstCall: true,
				sizes: [
					{
						viewportSize: [1440, 350],
						sizes: [
							[728, 90],
							[970, 250],
							[1024, 416],
							[1440, 585],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
					},
					{
						viewportSize: [1024, 300],
						sizes: [
							[728, 90],
							[970, 250],
							[1024, 416],
							universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop,
						],
					},
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
					[1024, 416],
					[1440, 585],
				],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
				},
			},
			top_boxad: {
				group: 'MR',
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [
							[300, 250],
							[320, 50],
						],
					},
					{
						viewportSize: [415, 200],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[300, 600],
							[300, 1050],
						],
					},
				],
				defaultSizes: [
					[300, 250],
					[300, 600],
					[300, 1050],
				],
				targeting: {
					loc: 'top',
				},
			},
			incontent_boxad: {
				disabled: true,
				group: 'HiVi',
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					loc(): string {
						return context.get('state.isMobile') ? 'footer' : 'hivi';
					},
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				defaultClasses: [HIDDEN_AD_CLASS],
				group: 'PF',
				outOfPage: false,
				targeting: {
					loc: 'footer',
				},
				defaultTemplates: ['floorAdhesion'],
				defaultSizes: [
					[300, 50],
					[320, 50],
					[320, 100],
				],
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
			bottom_leaderboard: {
				disabled: true,
				group: 'PF',
				sizes: [
					{
						viewportSize: [840, 100],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [320, 200],
						sizes: [],
					},
				],
				defaultSizes: [],
				targeting: {
					loc: 'footer',
				},
			},
			featured: {
				group: 'VIDEO',
				trackingKey: 'featured-video',
				isVideo: true,
			},
			video: {
				group: 'VIDEO',
				trackingKey: 'video',
				isVideo: true,
			},
		};

		slotsContext.setupSlotVideoContext();

		context.set('slots', slots);
	}
}
