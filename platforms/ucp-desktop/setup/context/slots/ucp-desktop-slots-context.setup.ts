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
							[10, 10],
						],
					},
				],
				defaultSizes: [[728, 90]],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					pos: ['top_leaderboard', 'hivi_leaderboard'],
					rv: 1,
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
					rv: 1,
				},
			},
			incontent_boxad_1: {
				lazyCall: true,
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
					rv: 1,
				},
			},
			bottom_leaderboard: {
				lazyCall: true,
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
					rv: 1,
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
				insertBeforeSelector: '#mw-content-text > div > h2',
				group: 'HiVi',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				group: 'PF',
				options: {},
				targeting: {
					loc: 'footer',
					rv: 1,
				},
				defaultTemplates: ['floorAdhesion'],
				defaultSizes: [[728, 90]],
			},
			invisible_high_impact_2: {
				adProduct: 'invisible_high_impact_2',
				group: 'PX',
				options: {},
				outOfPage: true,
				targeting: {
					loc: 'hivi',
					rv: 1,
				},
			},
			featured: {
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
				defaultSizes: [[728, 90]],
				group: 'quiz',
				options: {},
			},
			quiz_leaderboard_finish: {
				adProduct: 'quiz_leaderboard_finish',
				defaultSizes: [[728, 90]],
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
