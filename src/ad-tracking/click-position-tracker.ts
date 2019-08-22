import { AdSlot, context, slotService, utils } from '@ad-engine/core';

interface ClickPayload {
	x: number;
	y: number;
	elementWidth: number;
	elementHeight: number;
	source: string;
}

export interface ClickPositionContext {
	category: string;
	action: string;
	label: string;
}

class ClickPositionTracker {
	private middlewareService = new utils.MiddlewareService<ClickPositionContext>();
	private logGroup = 'click-position-tracker';

	add(middleware: utils.Middleware<ClickPositionContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	register(middleware: utils.Middleware<ClickPositionContext>, slotName: string): void {
		if (!this.isEnabled(slotName)) {
			return;
		}

		slotService.on(slotName, AdSlot.SLOT_RENDERED_EVENT, () => {
			this.addClickTrackingListeners(middleware, slotName);
		});
	}

	private isEnabled(slotName: string): boolean {
		return context.get(`slots.${slotName}.clickPositionTracking`);
	}

	private addClickTrackingListeners(
		middleware: utils.Middleware<ClickPositionContext>,
		slotName: string,
	): void {
		const slot: AdSlot = slotService.get(slotName);
		const iframeElement: HTMLIFrameElement = slot.getIframe();
		const slotElement: HTMLElement = slot.getElement();
		const elementHeight: number = slotElement.offsetHeight;
		const elementWidth: number = slotElement.offsetWidth;

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
				const y: number = e.clientY - window.innerHeight + elementHeight;

				this.handleClickEvent(middleware, {
					source: 'slot',
					x: e.clientX,
					elementHeight,
					elementWidth,
					y,
				});
			});
			iframeBody.addEventListener('click', (e: MouseEvent) => {
				this.handleClickEvent(middleware, {
					source: 'iframe',
					x: e.clientX,
					y: e.clientY,
					elementHeight,
					elementWidth,
				});
			});
		}
	}

	private handleClickEvent(
		middleware: utils.Middleware<ClickPositionContext>,
		clickPayload: ClickPayload,
	): void {
		this.middlewareService.execute(
			{
				category: 'click_position',
				action: 'click',
				label:
					`size=${clickPayload.elementWidth}x${clickPayload.elementHeight}` +
					`|x=${clickPayload.x}|y=${clickPayload.y}|source=${clickPayload.source}`,
			},
			middleware,
		);
	}
}

export const clickPositionTracker = new ClickPositionTracker();
