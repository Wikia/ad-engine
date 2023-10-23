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
				firstCall: true,
				adProduct: 'top_leaderboard',
				bidderAlias: 'mobile_top_leaderboard',
				group: 'LB',
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
				bidderAlias: 'mobile_in_content',
				group: 'MR',
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
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'mobile_in_content',
				group: 'HiVi',
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
				disabled: true,
				isVideo: true,
				trackEachStatus: true,
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
				},
			},
			mobile_prefooter: {
				adProduct: 'mobile_prefooter',
				disabled: true,
				group: 'PF',
				sizes: [],
				defaultSizes: [
					[320, 50],
					[300, 250],
					[300, 50],
				],
				targeting: {
					loc: 'footer',
				},
			},
			interstitial: {
				adProduct: 'interstitial',
				group: 'IU',
				outOfPage: true,
				outOfPageFormat: 'INTERSTITIAL',
				targeting: {
					loc: 'hivi',
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
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
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				group: 'PF',
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
			},
			quiz_leaderboard_questions: {
				adProduct: 'quiz_leaderboard_questions',
				defaultSizes: [[320, 50]],
				group: 'quiz',
			},
			quiz_leaderboard_finish: {
				adProduct: 'quiz_leaderboard_finish',
				defaultSizes: [[320, 50]],
				group: 'quiz',
			},
			quiz_incontent: {
				adProduct: 'quiz_incontent',
				defaultSizes: [[300, 250]],
				group: 'quiz',
			},
			gallery_leaderboard: {
				adProduct: 'gallery_leaderboard',
				bidderAlias: 'fandom_mw_galleries',
				group: 'IG',
				defaultSizes: [
					[320, 100],
					[320, 50],
				],
				targeting: {
					loc: 'gallery',
				},
				placeholder: {
					createLabel: true,
					adLabelParent: '.ad-slot-placeholder.gallery-leaderboard',
				},
			},
		};

		slotsContext.setupSlotVideoContext();
		slotsContext.setupCustomPlayerAdUnit();

		context.set('slots', slots);
		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}
}
