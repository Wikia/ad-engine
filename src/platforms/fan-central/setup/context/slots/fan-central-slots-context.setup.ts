import { slotsContext } from '@platforms/shared';
import { context, DiProcess, universalAdPackage } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FanCentralSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				group: 'LB',
				aboveTheFold: true,
				firstCall: true,
				sizes: [
					{
						viewportSize: [840, 200],
						sizes: [universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.desktop],
					},
					{
						viewportSize: [320, 200],
						sizes: [universalAdPackage.UAP_ADDITIONAL_SIZES.bfaSize.mobile],
						mobileViewport: true,
					},
					{
						viewportSize: [0, 0],
						sizes: [],
						mobileViewport: true,
					},
				],
				defaultSizes: [],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					uap: 'none',
					rv: 1,
				},
			},
			top_boxad: {
				group: 'MR',
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
			incontent_native: {
				group: 'ICN',
				sizes: [],
				defaultSizes: ['fluid'],
				targeting: {
					loc: 'middle',
					uap: 'none',
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				defaultClasses: ['hide'],
				group: 'PF',
				targeting: {
					loc: 'footer',
					uap: 'none',
					rv: 1,
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
						sizes: [
							[300, 50],
							[320, 50],
							[320, 100],
							[728, 90],
						],
					},
				],
			},
		};

		slotsContext.setupSlotVideoContext();

		context.set('slots', slots);
	}
}
