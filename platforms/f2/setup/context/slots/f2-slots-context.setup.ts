import { slotsContext } from '@platforms/shared';
import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2SlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				group: 'LB',
				slotShortcut: 'l',
				aboveTheFold: true,
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
						sizes: [[320, 50], [320, 480], universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
						mobileViewport: true,
					},
					{
						viewportSize: [0, 0],
						sizes: [[320, 50]],
						mobileViewport: true,
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
					uap: 'none',
					rv: 1,
				},
			},
			top_boxad: {
				group: 'MR',
				slotShortcut: 'm',
				aboveTheFold: true,
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
					uap: 'none',
					rv: 1,
				},
			},
			incontent_boxad: {
				disabled: true,
				group: 'HiVi',
				slotShortcut: 'f',
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
					uap: 'none',
					rv: 1,
				},
			},
			bottom_leaderboard: {
				disabled: true,
				group: 'PF',
				slotShortcut: 'b',
				sizes: [
					{
						viewportSize: [840, 100],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [320, 200],
						sizes: [],
						mobileViewport: true,
					},
				],
				defaultSizes: [],
				targeting: {
					loc: 'footer',
					uap: 'none',
					rv: 1,
				},
			},
			featured: {
				slotNameSuffix: '',
				group: 'VIDEO',
				targeting: {
					uap: 'none',
					rv: 1,
				},
				trackingKey: 'featured-video',
				isVideo: true,
			},
			video: {
				slotNameSuffix: '',
				group: 'VIDEO',
				targeting: {
					uap: 'none',
					rv: 1,
				},
				trackingKey: 'video',
				isVideo: true,
			},
		};

		slotsContext.setupSlotVideoContext();

		context.set('slots', slots);
	}
}
