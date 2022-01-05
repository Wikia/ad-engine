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
				placeholder: {
					createLabel: false,
					adLabelParent: '.top-ads-container',
				},
			},
			top_boxad: {
				adProduct: 'top_boxad',
				avoidConflictWith: '.ad-slot,.ntv-ad',
				bidderAlias: 'mobile_in_content',
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
				},
				placeholder: {
					createLabel: true,
				},
			},
			// as this slot can be repeated many, it uses bidderAlias mobile_in_content
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				avoidConflictWith: '.ad-slot,#incontent_player',
				bidderAlias: 'mobile_in_content',
				viewabilityCounterId: 'incontent_boxad',
				defaultClasses: ['hide', 'incontent-boxad', 'ad-slot'],
				slotNameSuffix: '',
				group: 'HiVi',
				options: {},
				parentContainerSelector: '.incontent-boxad',
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
				},
				placeholder: {
					createLabel: true,
				},
			},
			incontent_player: {
				adProduct: 'incontent_player',
				avoidConflictWith: '.ad-slot,#incontent_boxad_1',
				autoplay: true,
				audio: false,
				insertBeforeSelector: '.mw-parser-output > h2',
				parentContainerSelector: '.incontent-boxad',
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
				placeholder: {
					createLabel: true,
				},
			},
			interstitial: {
				adProduct: 'interstitial',
				defaultClasses: ['hide'],
				slotNameSuffix: '',
				group: 'IU',
				options: {},
				outOfPage: true,
				outOfPageFormat: 'INTERSTITIAL',
				targeting: {
					loc: 'hivi',
					rv: 1,
				},
			},
			floor_adhesion: {
				adProduct: 'floor_adhesion',
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
				placeholder: {
					createLabel: true,
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
				group: 'VIDEO',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'featured-video',
				trackEachStatus: true,
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
		context.set('slots.incontent_boxad_1.defaultClasses', ['hide', 'ad-slot']);
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
