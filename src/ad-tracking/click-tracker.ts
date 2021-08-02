import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'ad-click-tracker';
const adSlotLoadedEvent = globalAction(
	'[AdEngine] Ad Slot event',
	props<{ adSlotName: string; event: string }>(),
);

interface AdClickContext {
	slot: AdSlot;
	data: {
		ad_status: string;
	};
}

class AdClickTracker {
	private pipeline = new FuncPipeline<AdClickContext>();

	register(middleware: FuncPipelineStep<AdClickContext>): void {
		communicationService.action$
			.pipe(ofType(adSlotLoadedEvent))
			.subscribe(async ({ event, adSlotName }) => {
				if (event === AdSlot.SLOT_RENDERED_EVENT) {
					this.addClickTrackingListeners(middleware, adSlotName);
				}
			});
	}

	private addClickTrackingListeners(middleware: FuncPipelineStep<AdClickContext>, slotName): void {
		const adSlot = slotService.get(slotName);
		const iframeElement = adSlot.getIframe();
		const slotElement = adSlot.getElement();

		if (!adSlot || !iframeElement) {
			utils.logger(logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (!typeof iframeElement.contentWindow) {
			utils.logger(logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}

		const iframeBody = iframeElement.contentWindow.document.body;

		if (iframeBody && slotElement) {
			slotElement.addEventListener('click', () => {
				this.handleClickEvent(middleware, adSlot);
			});
			iframeBody.addEventListener('click', () => {
				this.handleClickEvent(middleware, adSlot);
			});
		}
	}

	private handleClickEvent(middleware: FuncPipelineStep<AdClickContext>, slot: AdSlot): void {
		this.pipeline.execute(
			{
				slot,
				data: {
					ad_status: AdSlot.STATUS_CLICKED,
				},
			},
			middleware,
		);
	}
}

export const adClickTracker = new AdClickTracker();
