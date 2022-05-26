import { slotsContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const BIG_VIEWPORT_SIZE = {
	height: 627,
	width: 375,
};

@Injectable()
export class UcpMobileSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				initStage: true,
				adProduct: 'top_leaderboard',
				bidderAlias: 'mobile_top_leaderboard',
				group: 'LB',
				options: {},
				sizes: [],
				defaultSizes: [
					[320, 50],
					[320, 100],
					[300, 50],
				],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					pos: ['top_leaderboard', 'mobile_top_leaderboard'],
					rv: 1,
				},
				placeholder: {
					createLabel: false,
					adLabelParent: '.top-ads-container',
				},
			},
			top_boxad: {
				adProduct: 'top_boxad',
				avoidConflictWith: '.ad-slot,.ntv-ad',
				bidderAlias: 'mobile_in_content',
				group: 'MR',
				options: {},
				sizes: [
					{
						viewportSize: [BIG_VIEWPORT_SIZE.width, BIG_VIEWPORT_SIZE.height],
						sizes: [
							[300, 50],
							[320, 50],
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[320, 50],
					[300, 250],
					[300, 50],
				],
				targeting: {
					loc: 'top',
					pos: ['top_boxad'],
					rv: 1,
				},
				placeholder: {
					createLabel: true,
				},
			},
			// as this slot can be repeated many, it uses bidderAlias mobile_in_content
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				avoidConflictWith: '.ad-slot,#incontent_player',
				bidderAlias: 'mobile_in_content',
				viewabilityCounterId: 'incontent_boxad',
				defaultClasses: ['hide', 'ad-slot'],
				group: 'HiVi',
				options: {},
				parentContainerSelector: '.incontent-boxad',
				sizes: [
					{
						viewportSize: [BIG_VIEWPORT_SIZE.width, BIG_VIEWPORT_SIZE.height],
						sizes: [
							[300, 50],
							[320, 50],
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[320, 50],
					[300, 250],
					[300, 50],
				],
				targeting: {
					loc: 'middle',
					pos: ['incontent_boxad'],
					rv: 1,
				},
				placeholder: {
					createLabel: true,
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				avoidConflictWith: '.ad-slot,#incontent_boxad_1',
				autoplay: true,
				audio: false,
				insertBeforeSelector: '.mw-parser-output > h2',
				parentContainerSelector: '.incontent-boxad',
				defaultClasses: ['hide'],
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
					rv: 1,
				},
				isVideo: true,
			},
			mobile_prefooter: {
				adProduct: 'mobile_prefooter',
				disabled: true,
				group: 'PF',
				options: {},
				sizes: [],
				defaultSizes: [
					[320, 50],
					[300, 250],
					[300, 50],
				],
				targeting: {
					loc: 'footer',
					rv: 1,
				},
				placeholder: {
					createLabel: true,
				},
			},
			interstitial: {
				adProduct: 'interstitial',
				defaultClasses: ['hide'],
				group: 'IU',
				options: {},
				outOfPage: true,
				outOfPageFormat: 'INTERSTITIAL',
				targeting: {
					loc: 'hivi',
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				defaultClasses: ['hide'],
				group: 'PF',
				options: {},
				outOfPage: false,
				targeting: {
					loc: 'footer',
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
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				group: 'PF',
				options: {},
				sizes: [
					{
						viewportSize: [375, 627],
						sizes: [
							[300, 50],
							[320, 50],
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[320, 50],
					[300, 250],
					[300, 50],
				],
				targeting: {
					loc: 'footer',
					pos: ['bottom_leaderboard', 'mobile_prefooter'],
					rv: 1,
				},
				placeholder: {
					createLabel: true,
				},
			},
			invisible_high_impact_2: {
				adProduct: 'invisible_high_impact_2',
				defaultClasses: ['hide'],
				group: 'PX',
				options: {},
				outOfPage: true,
				targeting: {
					loc: 'hivi',
					rv: 1,
				},
			},
			featured: {
				initStage: true,
				adProduct: 'featured',
				group: 'VIDEO',
				videoSizes: [[640, 480]],
				targeting: {
					rv: 1,
				},
				trackEachStatus: true,
				trackingKey: 'featured-video',
				isVideo: true,
			},
			ntv_ad: {
				providers: ['nativo'],
				trackEachStatus: true,
			},
			ntv_feed_ad: {
				providers: ['nativo'],
				trackEachStatus: true,
			},
			quiz_leaderboard_start: {
				adProduct: 'quiz_leaderboard_start',
				defaultSizes: [[320, 50]],
				group: 'quiz',
				options: {},
			},
			quiz_leaderboard_finish: {
				adProduct: 'quiz_leaderboard_finish',
				defaultSizes: [[320, 50]],
				group: 'quiz',
				options: {},
			},
			quiz_incontent: {
				adProduct: 'quiz_incontent',
				defaultSizes: [[300, 250]],
				group: 'quiz',
				options: {},
			},
		};

		slotsContext.setupSlotVideoContext();

		context.set('slots', slots);
		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}
}
