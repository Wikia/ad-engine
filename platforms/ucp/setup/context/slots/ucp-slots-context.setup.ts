import { SlotsContextSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { slotsContext } from '../../../../shared/slots/slots-context';
import { UcpTargetingSetup } from '../targeting/ucp-targeting.setup';

@Injectable()
export class UcpSlotsContextSetup implements SlotsContextSetup {
	constructor(private targetingSetup: UcpTargetingSetup) {}

	configureSlotsContext(): void {
		const slots = {
			hivi_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'hivi_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				nextSiblingSelector: '.wds-global-navigation-wrapper',
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
				nextSiblingSelector: '.WikiaPage',
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
				nextSiblingSelector: '.rcs-container, .wikia-rail-inner',
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
				nextSiblingSelector: '',
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
				nextSiblingSelector: '.mcf-en',
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
				avoidConflictWith: null,
				autoplay: true,
				audio: false,
				insertBeforeSelector: '#mw-content-text > h2',
				insertBelowFirstViewport: true,
				disabled: true,
				slotNameSuffix: '',
				group: 'HiVi',
				nextSiblingSelector: '',
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
				nextSiblingSelector: '',
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
				nextSiblingSelector: '',
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
				nextSiblingSelector: '',
				lowerSlotName: 'featured',
				videoSizes: [[640, 480]],
				targeting: {
					rv: 1,
				},
				trackEachStatus: true,
				trackingKey: 'featured-video',
			},
		};

		context.set('slots', slots);

		// context.set('slots', slots) must be called first!
		if (!this.targetingSetup.getVideoStatus().hasVideoOnPage) {
			slotsContext.addSlotSize('hivi_leaderboard', [3, 3]);
		}
	}
}
