import { context, DiProcess, events, eventService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class UcpDesktopSlotsContextSetup implements DiProcess {
	constructor() {}

	execute(): void {
		const slots = {
			hivi_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'hivi_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				parentContainerSelector: '.top-leaderboard',
				options: {},
				slotShortcut: 'v',
				sizes: [
					{
						viewportSize: [1024, 0],
						sizes: [
							[728, 90],
							[970, 250],
						],
					},
				],
				defaultSizes: [[728, 90]],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					rv: 1,
				},
			},
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				group: 'LB',
				parentContainerSelector: '.top-leaderboard',
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
				parentContainerSelector: '.main-page-tag-rcs, #rail-boxad-wrapper',
				insertIntoParentContainerMethod: 'prepend',
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
				adProduct: 'incontent_boxad_1',
				bidderAlias: 'incontent_boxad_1',
				slotNameSuffix: '',
				group: 'HiVi',
				parentContainerSelector: '#WikiaAdInContentPlaceHolder',
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
				parentContainerSelector: '.bottom-leaderboard',
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
				insertBelowFirstViewport: true,
				disabled: true,
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
				disabled: true,
				slotNameSuffix: '',
				group: 'PF',
				insertBeforeSelector: '.page',
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
				insertBeforeSelector: '.page',
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

		eventService.on(events.AD_SLOT_CREATED, (slot) => {
			context.onChange(`slots.${slot.getSlotName()}.audio`, () => this.setupSlotParameters(slot));
			context.onChange(`slots.${slot.getSlotName()}.videoDepth`, () =>
				this.setupSlotParameters(slot),
			);
		});
		context.set('slots', slots);
		context.set('slots.featured.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
		context.set('slots.incontent_player.videoAdUnit', context.get('vast.adUnitIdWithDbName'));
	}

	private setupSlotParameters(slot): void {
		const audioSuffix = slot.config.audio === true ? '-audio' : '';
		const clickToPlaySuffix =
			slot.config.autoplay === true || slot.config.videoDepth > 1 ? '' : '-ctp';

		slot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
		slot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
		slot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
	}
}
