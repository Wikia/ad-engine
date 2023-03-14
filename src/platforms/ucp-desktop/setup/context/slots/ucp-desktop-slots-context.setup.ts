import { slotsContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				group: 'LB',
				options: {},
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [
							[728, 90],
							[970, 66],
							[970, 90],
							[970, 150],
							[970, 180],
							[970, 250],
							[970, 365],
							[1024, 416],
							[1030, 65],
							[1030, 130],
							[1030, 250],
						],
					},
				],
				defaultSizes: [[728, 90]],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					pos: ['top_leaderboard', 'hivi_leaderboard'],
				},
				placeholder: {
					createLabel: false,
					adLabelParent: '.top-ads-container',
				},
			},
			top_boxad: {
				adProduct: 'top_boxad',
				aboveTheFold: true,
				group: 'MR',
				options: {},
				defaultSizes: [
					[300, 250],
					[300, 600],
					[300, 1050],
				],
				targeting: {
					loc: 'top',
				},
			},
			incontent_leaderboard: {
				adProduct: 'incontent_leaderboard',
				group: 'ILB',
				options: {},
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'middle',
				},
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'incontent_boxad_1',
				group: 'HiVi',
				insertBeforeSelector: '#incontent_boxad_1',
				recirculationElementSelector: '#recirculation-rail',
				options: {},
				sizes: [],
				defaultSizes: [
					[120, 600],
					[160, 600],
					[300, 250],
					[300, 600],
				],
				targeting: {
					loc: 'hivi',
				},
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				group: 'PF',
				options: {},
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [
							[728, 90],
							[970, 66],
							[970, 90],
							[970, 150],
							[970, 180],
							[970, 250],
							[970, 365],
							[1024, 416],
							[1030, 65],
							[1030, 130],
							[1030, 250],
						],
					},
				],
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'footer',
				},
				placeholder: {
					createLabel: false,
					adLabelParent: '.bottom-ads-container',
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				autoplay: true,
				audio: false,
				isVideo: true,
				trackEachStatus: true,
				insertBeforeSelector: '#mw-content-text > div > h2',
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
				},
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
				defaultSizes: [
					[728, 90],
					[728, 150],
				],
				group: 'quiz',
				options: {},
			},
			quiz_leaderboard_questions: {
				adProduct: 'quiz_leaderboard_questions',
				defaultSizes: [
					[728, 90],
					[728, 150],
				],
				group: 'quiz',
				options: {},
			},
			quiz_leaderboard_finish: {
				adProduct: 'quiz_leaderboard_finish',
				defaultSizes: [
					[728, 90],
					[728, 150],
				],
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
