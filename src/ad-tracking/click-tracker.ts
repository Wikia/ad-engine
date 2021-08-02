import { AdSlot, eventService, FuncPipeline, FuncPipelineStep, utils } from '@ad-engine/core';

class AdClickTracker {
	private pipeline = new FuncPipeline<any>();

	private logGroup = 'ad-click-tracker';

	register(middleware: any): void {
		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot: AdSlot) => {
			this.addClickTrackingListeners(middleware, slot);
		});
	}

	private addClickTrackingListeners(middleware: FuncPipelineStep<any>, slot: AdSlot): void {
		const slotName = slot.getSlotName();
		const iframeElement = slot.getIframe();
		const slotElement = slot.getElement();

		if (!slot || !iframeElement) {
			utils.logger(this.logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (!typeof iframeElement.contentWindow) {
			utils.logger(this.logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}
		const iframeBody: HTMLElement = iframeElement.contentWindow.document.body;

		if (iframeBody && slotElement) {
			slotElement.addEventListener('click', () => {
				this.handleClickEvent(middleware, slot);
			});
			iframeBody.addEventListener('click', () => {
				this.handleClickEvent(middleware, slot);
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
