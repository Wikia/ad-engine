import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { AdSlot, FuncPipeline, FuncPipelineStep, slotService, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'ad-click-tracker';

const adSlotLoadedEvent = globalAction(
	'[AdEngine] Ad Slot event',
	props<{ adSlotName: string; status: string; event: string }>(),
);

class AdClickTracker {
	private pipeline = new FuncPipeline<any>();

	register(middleware: any): void {
		communicationService.action$
			.pipe(ofType(adSlotLoadedEvent))
			.subscribe(async ({ event, adSlotName }) => {
				if (event === AdSlot.SLOT_RENDERED_EVENT) {
					this.addClickTrackingListeners(middleware, adSlotName);
					utils.logger(logGroup, 'registered');
				}
			});
	}

	private addClickTrackingListeners(middleware: FuncPipelineStep<any>, slotName): void {
		const adSlot = slotService.get(slotName);
		const iframeElement: HTMLIFrameElement = adSlot.getIframe();
		const slotElement: HTMLElement = adSlot.getElement();

		if (!adSlot || !iframeElement) {
			utils.logger(logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (!typeof iframeElement.contentWindow) {
			utils.logger(logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}

		const iframeBody: HTMLElement = iframeElement.contentWindow.document.body;

		if (iframeBody && slotElement) {
			slotElement.addEventListener('click', () => {
				this.handleClickEvent(middleware, adSlot);
			});
			iframeBody.addEventListener('click', () => {
				this.handleClickEvent(middleware, adSlot);
			});
		}
	}

	private handleClickEvent(middleware: any, slot: AdSlot): void {
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
