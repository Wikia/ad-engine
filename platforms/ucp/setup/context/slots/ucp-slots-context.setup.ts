import { SlotsContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpSlotsContextSetup implements SlotsContextSetup {
	constructor() {}

	configureSlotsContext(): void {
		const slotsFandom = {
			hivi_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'hivi_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				insertBeforeSelector: '.wds-global-navigation-wrapper',
				options: {},
				slotShortcut: 'v',
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [[728, 90], [970, 250]],
					},
				],
				defaultSizes: [[728, 90]],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					rv: 1,
					xna: 1,
				},
			},
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				insertBeforeSelector: '.WikiaPage',
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
					rv: 1,
					xna: 1,
				},
			},
			top_boxad: {
				adProduct: 'top_boxad',
				aboveTheFold: true,
				slotNameSuffix: '',
				group: 'MR',
				insertBeforeSelector: '.rcs-container, .wikia-rail-inner',
				options: {},
				slotShortcut: 'm',
				defaultSizes: [[300, 250], [300, 600], [300, 1050]],
				targeting: {
					loc: 'top',
					rv: 1,
				},
			},
			invisible_skin: {
				adProduct: 'invisible_skin',
				aboveTheFold: true,
				group: 'PX',
				options: {},
				slotNameSuffix: '',
				slotShortcut: 'x',
				sizes: [
					{
						viewportSize: [1240, 0],
						sizes: [[1, 1], [1000, 1000]],
					},
				],
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'top',
					rv: 1,
				},
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'incontent_boxad_1',
				slotNameSuffix: '',
				group: 'HiVi',
				parentContainerSelector: '#WikiaAdInContentPlaceHolder',
				options: {},
				slotShortcut: 'f',
				sizes: [],
				defaultSizes: [[120, 600], [160, 600], [300, 250], [300, 600]],
				insertBeforeSelector: '#incontent_boxad_1',
				garfieldCat: true,
				repeat: {
					additionalClasses: 'hide',
					index: 1,
					limit: 20,
					slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
					},
					insertBelowScrollPosition: false,
					disablePushOnScroll: true,
				},
				targeting: {
					loc: 'hivi',
					rv: 1,
				},
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				slotNameSuffix: '',
				group: 'PF',
				insertBeforeSelector: '.mcf-en',
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
					xna: 1,
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				autoplay: true,
				audio: false,
				isVideo: true,
				insertBeforeSelector: '#mw-content-text > div > h2',
				insertBelowFirstViewport: true,
				disabled: true,
				nonUapSlot: true,
				slotNameSuffix: '',
				group: 'HiVi',
				slotShortcut: 'i',
				defaultSizes: [[1, 1]],
				targeting: {
					loc: 'middle',
					pos: ['incontent_player'],
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				disabled: true,
				forceSafeFrame: true,
				slotNameSuffix: '',
				group: 'PF',
				options: {},
				targeting: {
					loc: 'footer',
					rv: 1,
				},
				defaultTemplates: ['floorAdhesion', 'hideOnViewability'],
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
				nonUapSlot: true,
				group: 'VIDEO',
				lowerSlotName: 'featured',
				videoSizes: [[640, 480]],
				targeting: {
					rv: 1,
				},
				trackEachStatus: true,
				trackingKey: 'featured-video',
				isVideo: true,
			},
		};

		const slotsCurse = {
			'cdm-zone-01': {
				aboveTheFold: true,
				adProduct: 'cdm-zone-01',
				slotNameSuffix: '',
				defaultSizes: [[728, 90], [970, 150], [970, 250]],
				firstCall: true,
				bidderAlias: '01_LB',
				group: '01_LB',
				insertBeforeSelector: '#firstHeading',
				sizes: [
					{
						viewportSize: [1024, 300],
						sizes: [[728, 90], [970, 150], [970, 250], [980, 150], [980, 250]],
					},
					{
						viewportSize: [970, 200],
						sizes: [[728, 90], [970, 150], [970, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [0, 0],
						sizes: [[320, 50], [320, 100]],
						mobileViewport: true,
					},
				],
				targeting: {
					loc: 'top',
					zne: '01',
					rv: 1,
				},
			},
			'cdm-zone-02': {
				aboveTheFold: true,
				adProduct: 'cdm-zone-02',
				slotNameSuffix: '',
				defaultSizes: [[300, 250], [300, 600]],
				bidderAlias: '02_MR',
				group: '02_MR',
				insertBeforeSelector: '',
				sizes: [],
				targeting: {
					loc: 'top',
					zne: '02',
					rv: 1,
				},
			},
			'cdm-zone-03': {
				adProduct: 'cdm-zone-03',
				slotNameSuffix: '',
				defaultSizes: [[300, 250]],
				bidderAlias: '03_PF',
				group: '03_PF',
				insertBeforeSelector: '#curse-footer',
				sizes: [],
				targeting: {
					loc: 'footer',
					zne: '03',
					rv: 1,
				},
			},
			'cdm-zone-04': {
				adProduct: 'cdm-zone-04',
				slotNameSuffix: '',
				defaultSizes: [[728, 90]],
				bidderAlias: '04_BLB',
				group: '04_BLB',
				insertBeforeSelector: '#catlinks',
				sizes: [],
				targeting: {
					loc: 'middle',
					zne: '04',
					rv: 1,
				},
			},
			'cdm-zone-06': {
				adProduct: 'cdm-zone-06',
				slotNameSuffix: '',
				defaultSizes: [[300, 250]],
				bidderAlias: '06_FMR',
				group: '06_FMR',
				insertBeforeSelector: '',
				sizes: [],
				targeting: {
					loc: 'footer',
					zne: '06',
					rv: 1,
				},
			},
		};

		if (context.get('targeting.skin') === 'hydra') {
			context.set('slots', slotsCurse);
		} else {
			context.set('slots', slotsFandom);
		}

		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}
}
