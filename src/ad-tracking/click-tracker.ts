import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'ad-click-tracker';
const adSlotLoadedEvent = globalAction(
	'[AdEngine] Ad Slot event',
	props<{ adSlotName: string; event: string }>(),
);
export const videoLearnMoreDisplayedEvent = globalAction(
	'[AdEngine] Video learn more displayed',
	props<{ adSlotName: string; learnMoreLink: HTMLElement }>(),
);

export const collapsedAdEvent = globalAction(
	'[AdEngine] Collapsed ad hidden',
	props<{ adSlotName: string; collapseButton: HTMLElement }>(),
);

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
		click_position?: string;
	};
}

class AdClickTracker {
	private pipeline = new FuncPipeline<AdClickContext>();

	add(...middlewares: FuncPipelineStep<AdClickContext>[]): this {
		this.pipeline.add(...middlewares);

		return this;
	}

	register(callback: FuncPipelineStep<AdClickContext>): void {
		communicationService.action$
			.pipe(ofType(adSlotLoadedEvent))
			.subscribe(async ({ event, adSlotName }) => {
				if (event === AdSlot.SLOT_RENDERED_EVENT) {
					this.addClickTrackingListeners(callback, adSlotName);
				}
			});

		communicationService.action$
			.pipe(ofType(videoLearnMoreDisplayedEvent))
			.subscribe(async ({ adSlotName, learnMoreLink }) => {
				this.addClickVideoLearnMoreTrackingListeners(callback, adSlotName, learnMoreLink);
			});

		communicationService.action$
			.pipe(ofType(collapsedAdEvent))
			.subscribe(async ({ adSlotName, collapseButton }) => {
				collapseButton.addEventListener('click', () => {
					this.handleClickEvent(callback, slotService.get(adSlotName));
				});
			});
	}

	private addClickTrackingListeners(callback: FuncPipelineStep<AdClickContext>, slotName): void {
		const adSlot = slotService.get(slotName);
		const iframeElement = adSlot.getIframe();
		const slotElement = adSlot.getAdContainer();

		if (!adSlot || !iframeElement) {
			utils.logger(logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (adSlot.getFrameType() === 'safe') {
			utils.logger(logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}

		const iframeBody = iframeElement.contentWindow.document.body;

		if (iframeBody && slotElement) {
			slotElement.firstElementChild.addEventListener('click', () => {
				this.handleClickEvent(callback, adSlot);
			});
			iframeBody.addEventListener('click', (e) => {
				this.handleClickEvent(callback, adSlot, e);
			});
		}
	}

	private addClickVideoLearnMoreTrackingListeners(
		callback: FuncPipelineStep<AdClickContext>,
		adSlotName: string,
		learnMoreLink: HTMLElement,
	): void {
		learnMoreLink.addEventListener('click', () => {
			this.handleClickEvent(callback, slotService.get(adSlotName));
		});
	}

	private handleClickEvent(
		callback: FuncPipelineStep<AdClickContext>,
		slot: AdSlot,
		event?: MouseEvent,
	): void {
		let adStatus = AdSlot.STATUS_CLICKED;
		if (slot.getStatus() === AdSlot.STATUS_CLICKED_COLLAPSE) {
			adStatus = AdSlot.STATUS_CLICKED_COLLAPSE;
		}
		const data = { ad_status: adStatus };
		if (event) {
			const target = event.target as HTMLElement;
			const clickData = {
				click: { x: event.clientX, y: event.clientY },
				size: { x: target.offsetWidth, y: target.offsetHeight },
			};
			data['click_position'] = JSON.stringify(clickData);
		}
		this.pipeline.execute(
			{
				slot,
				data,
			},
			callback,
		);
	}
}

export const adClickTracker = new AdClickTracker();
