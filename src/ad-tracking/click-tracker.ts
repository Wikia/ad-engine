import {
	AdSlot,
	eventService,
	FuncPipeline,
	FuncPipelineStep,
	slotService,
	utils,
} from '@ad-engine/core';

class ClickTracker {
	private pipeline = new FuncPipeline<any>();

	private logGroup = 'click-tracker';

	register(middleware: any): void {
		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot: AdSlot) => {
			const slotName = slot.getSlotName();
			this.addClickTrackingListeners(middleware, slotName);
		});
	}

	private addClickTrackingListeners(middleware: FuncPipelineStep<any>, slotName: string): void {
		const slot: AdSlot = slotService.get(slotName);
		const iframeElement: HTMLIFrameElement = slot.getIframe();
		const slotElement: HTMLElement = slot.getElement();

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
			slotElement.addEventListener('click', (e: MouseEvent) => {
				this.handleClickEvent(middleware, slotName);
			});
			iframeBody.addEventListener('click', (e: MouseEvent) => {
				this.handleClickEvent(middleware, slotName);
			});
		}
	}

	private handleClickEvent(middleware: any, slotName: string): void {
		this.pipeline.execute(
			{
				slotName,
				data: {
					ad_status: AdSlot.STATUS_CLICKED,
				},
			},
			middleware,
		);
	}
}

export const clickTracker = new ClickTracker();
