import { context, DiProcess, events, eventService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

const BIG_VIEWPORT_SIZE = {
	height: 627,
	width: 375,
};

@Injectable()
export class UcpMobileSlotsContextSetup implements DiProcess {
	constructor() {}

	execute(): void {
		const slots = {
			top_leaderboard: {
				aboveTheFold: true,
				firstCall: true,
				adProduct: 'top_leaderboard',
				slotNameSuffix: '',
				bidderAlias: 'mobile_top_leaderboard',
				group: 'LB',
				options: {},
				slotShortcut: 'l',
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
			},
			top_boxad: {
				adProduct: 'top_boxad',
				avoidConflictWith: '.ad-slot',
				bidderAlias: 'mobile_in_content',
				cheshireCatSlot: true,
				slotNameSuffix: '',
				group: 'MR',
				options: {},
				slotShortcut: 'm',
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
					xna: 1,
				},
			},
			// as this slot can be repeated many, it uses bidderAlias mobile_in_content
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				avoidConflictWith: '.ad-slot,#incontent_player',
				bidderAlias: 'mobile_in_content',
				viewabilityCounterId: 'incontent_boxad',
				cheshireCatSlot: true,
				defaultClasses: ['hide', 'incontent-boxad', 'ad-slot'],
				slotNameSuffix: '',
				group: 'HiVi',
				options: {},
				insertBeforeSelector: '.article-content > h2',
				repeat: {
					index: 1,
					limit: 20,
					slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
					updateProperties: {
						adProduct: '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}',
						'targeting.pos': ['incontent_boxad'],
					},
					insertBelowScrollPosition: true,
				},
				slotShortcut: 'f',
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
					xna: 1,
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				avoidConflictWith: '.ad-slot,#incontent_boxad_1',
				autoplay: true,
				audio: false,
				insertBeforeSelector: '.article-content > h2',
				disabled: true,
				defaultClasses: ['hide'],
				slotNameSuffix: '',
				group: 'HiVi',
				slotShortcut: 'i',
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
				slotNameSuffix: '',
				disabled: true,
				disableManualInsert: true,
				group: 'PF',
				options: {},
				slotShortcut: 'p',
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
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
				disabled: true,
				disableManualInsert: true,
				defaultClasses: ['hide'],
				slotNameSuffix: '',
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
				slotNameSuffix: '',
				group: 'PF',
				options: {},
				slotShortcut: 'b',
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
			},
			invisible_high_impact_2: {
				adProduct: 'invisible_high_impact_2',
				slotNameSuffix: '',
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
				adProduct: 'featured',
				slotNameSuffix: '',
				nonUapSlot: true,
				group: 'VIDEO',
				lowerSlotName: 'featured',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'featured-video',
				trackEachStatus: true,
				isVideo: true,
			},
			video: {
				adProduct: 'video',
				slotNameSuffix: '',
				nonUapSlot: true,
				group: 'VIDEO',
				lowerSlotName: 'video',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'video',
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
