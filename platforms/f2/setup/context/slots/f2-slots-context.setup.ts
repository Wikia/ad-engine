import { context, DiProcess, events, eventService } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class F2SlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			top_leaderboard: {
				group: 'LB',
				slotShortcut: 'l',
				aboveTheFold: true,
				firstCall: true,
				sizes: [
					{
						viewportSize: [1440, 350],
						sizes: [
							[728, 90],
							[970, 250],
							[1024, 416],
							[1440, 585],
							[3, 3],
						],
					},
					{
						viewportSize: [1024, 300],
						sizes: [
							[728, 90],
							[970, 250],
							[1024, 416],
							[3, 3],
						],
					},
					{
						viewportSize: [970, 200],
						sizes: [
							[728, 90],
							[970, 250],
							[3, 3],
						],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[728, 90],
							[3, 3],
						],
					},
					{
						viewportSize: [320, 200],
						sizes: [
							[320, 50],
							[320, 480],
							[2, 2],
						],
						mobileViewport: true,
					},
					{
						viewportSize: [0, 0],
						sizes: [[320, 50]],
						mobileViewport: true,
					},
				],
				defaultSizes: [
					[728, 90],
					[970, 250],
					[1024, 416],
					[1440, 585],
				],
				defaultTemplates: [],
				targeting: {
					loc: 'top',
					uap: 'none',
					rv: 1,
				},
			},
			bottom_leaderboard: {
				disabled: true,
				group: 'PF',
				slotShortcut: 'b',
				sizes: [
					{
						viewportSize: [840, 100],
						sizes: [[728, 90]],
					},
					{
						viewportSize: [320, 200],
						sizes: [],
						mobileViewport: true,
					},
				],
				defaultSizes: [],
				targeting: {
					loc: 'footer',
					uap: 'none',
					rv: 1,
				},
			},
			top_boxad: {
				group: 'MR',
				slotShortcut: 'm',
				aboveTheFold: true,
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [
							[300, 250],
							[320, 50],
						],
					},
					{
						viewportSize: [415, 200],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[300, 600],
							[300, 1050],
						],
					},
				],
				defaultSizes: [
					[300, 250],
					[300, 600],
					[300, 1050],
				],
				targeting: {
					loc: 'top',
					uap: 'none',
					rv: 1,
				},
			},
			incontent_boxad: {
				disabled: true,
				group: 'HiVi',
				slotShortcut: 'f',
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					loc(): string {
						return context.get('state.isMobile') ? 'footer' : 'hivi';
					},
					uap: 'none',
					rv: 1,
				},
			},
			feed_boxad: {
				disabled: true,
				group: 'PF',
				slotShortcut: 'e',
				sizes: [
					{
						viewportSize: [0, 0],
						sizes: [[300, 250]],
					},
					{
						viewportSize: [840, 200],
						sizes: [
							[300, 250],
							[300, 600],
						],
					},
				],
				defaultSizes: [
					[300, 250],
					[300, 600],
				],
				targeting: {
					loc: 'footer',
					uap: 'none',
					rv: 1,
				},
			},
			featured: {
				slotNameSuffix: '',
				nonUapSlot: true,
				group: 'VIDEO',
				targeting: {
					uap: 'none',
					rv: 1,
				},
				trackingKey: 'featured-video',
			},
			video: {
				slotNameSuffix: '',
				nonUapSlot: true,
				group: 'VIDEO',
				targeting: {
					uap: 'none',
					rv: 1,
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
