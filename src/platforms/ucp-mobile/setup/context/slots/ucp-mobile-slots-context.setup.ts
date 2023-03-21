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
				},
				placeholder: {
					createLabel: true,
				},
			},
			// as this slot can be repeated many, it uses bidderAlias mobile_in_content
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'mobile_in_content',
				group: 'HiVi',
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
					loc: 'middle',
					pos: ['incontent_boxad'],
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				avoidConflictWith: '.ad-slot,#incontent_boxad_1',
				autoplay: true,
				audio: false,
				insertBeforeSelector:
					'.mw-parser-output > h2,.mw-parser-output > section > h3,.mw-parser-output > section > h4,.mw-parser-output > section > h5',
				parentContainerSelector: '.incontent-boxad',
				defaultClasses: ['hide'],
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
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
				},
				placeholder: {
					createLabel: true,
				},
			},
			featured: {
				adProduct: 'featured',
				group: 'VIDEO',
				videoSizes: [[640, 480]],
				trackEachStatus: true,
				trackingKey: 'featured-video',
				isVideo: true,
			},
			ntv_ad: {
				providers: ['nativo'],
				trackEachStatus: true,
				isNative: true,
			},
			ntv_feed_ad: {
				providers: ['nativo'],
				trackEachStatus: true,
				isNative: true,
			},
			quiz_leaderboard_start: {
				adProduct: 'quiz_leaderboard_start',
				defaultSizes: [[320, 50]],
				group: 'quiz',
				options: {},
			},
			quiz_leaderboard_questions: {
				adProduct: 'quiz_leaderboard_questions',
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
