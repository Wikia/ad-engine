import { slotsContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				firstCall: true,
				adProduct: 'top_leaderboard',
				group: 'LB',
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
				slotRefreshing: true,
			},
			top_boxad: {
				adProduct: 'top_boxad',
				group: 'MR',
				defaultSizes: [
					[300, 250],
					[300, 600],
					[300, 1050],
				],
				targeting: {
					loc: 'top',
				},
				slotRefreshing: true,
			},
			incontent_leaderboard: {
				adProduct: 'incontent_leaderboard',
				bidderAlias: 'incontent_leaderboard',
				group: 'ILB',
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'middle',
				},
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				group: 'HiVi',
				recirculationElementSelector: '#recirculation-rail',
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
				slotRefreshing: true,
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
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				disabled: true,
				group: 'PF',
				targeting: {
					loc: 'footer',
				},
				defaultTemplates: ['floorAdhesion'],
				defaultSizes: [[728, 90]],
			},
			featured: {
				adProduct: 'featured',
				isVideo: true,
				group: 'VIDEO',
				videoSizes: [[640, 480]],
				trackEachStatus: true,
				trackingKey: 'featured-video',
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
			},
			quiz_leaderboard_questions: {
				adProduct: 'quiz_leaderboard_questions',
				defaultSizes: [
					[728, 90],
					[728, 150],
				],
				group: 'quiz',
			},
			quiz_leaderboard_finish: {
				adProduct: 'quiz_leaderboard_finish',
				defaultSizes: [
					[728, 90],
					[728, 150],
				],
				group: 'quiz',
			},
			quiz_incontent: {
				adProduct: 'quiz_incontent',
				defaultSizes: [[300, 250]],
				group: 'quiz',
			},
			gallery_leaderboard: {
				adProduct: 'gallery_leaderboard',
				bidderAlias: 'fandom_dt_galleries',
				a9Alias: 'gallery_leaderboard', // overwrite alias for A9, it's configured with the slot name not alias
				group: 'IG',
				defaultSizes: [[728, 90]],
				targeting: {
					loc: 'gallery',
				},
				placeholder: {
					createLabel: true,
					adLabelParent: '.ad-slot-placeholder.gallery-leaderboard',
				},
				bidGroup: 'gallery',
			},
		};

		slotsContext.setupSlotVideoContext();
		slotsContext.setupCustomPlayerAdUnit();

		context.set('slots', slots);
		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}
}
