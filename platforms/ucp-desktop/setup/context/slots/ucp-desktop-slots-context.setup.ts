import { slotsContext } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			layout_initializer: {
				initCall: true,
				adProduct: 'layout_initializer',
				slotNameSuffix: '',
				group: 'LIS',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'pre',
				},
			},
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				options: {},
				slotShortcut: 'l',
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
				slotNameSuffix: '',
				group: 'MR',
				options: {},
				slotShortcut: 'm',
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
				slotNameSuffix: '',
				group: 'HiVi',
				insertBeforeSelector: '#incontent_boxad_1',
				recirculationElementSelector: '#recirculation-rail',
				options: {},
				slotShortcut: 'f',
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
				slotNameSuffix: '',
				group: 'PF',
				options: {},
				slotShortcut: 'b',
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
				slotNameSuffix: '',
				group: 'HiVi',
				slotShortcut: 'i',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['outstream'],
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				slotNameSuffix: '',
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
				slotNameSuffix: '',
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
				slotNameSuffix: '',
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
		};

		slotsContext.setupSlotVideoContext();

		context.set('slots', slots);
		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}
}
