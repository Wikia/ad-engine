import { AdSlot, context, slotService, utils } from '@ad-engine/core';

export interface ClickPositionContext {
	data: any;
}

interface Coordinates {
	x: number;
	y: number;
}

class ClickPositionTracker {
	private middlewareService = new utils.MiddlewareService<ClickPositionContext>();
	private logGroup = 'click-position-tracker';

	add(middleware: utils.Middleware<ClickPositionContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	handleClickEvent(
		callback: utils.Middleware<ClickPositionContext>,
		event: Coordinates,
		elementWidth: number,
		elementHeight: number,
		source: string,
	): void {
		this.middlewareService.execute(
			{
				data: {
					category: 'click_position',
					action: 'click',
					label:
						`size=${elementWidth}x${elementHeight}` + `|x=${event.x}|y=${event.y}|source=${source}`,
				},
			},
			callback,
		);
	}

	isEnabled(slotName: string): boolean {
		return context.get(`slots.${slotName}.clickPositionTracking`);
	}

	register(callback: utils.Middleware<ClickPositionContext>, slotName: string): void {
		if (!this.isEnabled(slotName)) {
			return;
		}

		slotService.on(slotName, AdSlot.SLOT_RENDERED_EVENT, () => {
			this.addClickTrackingListeners(callback, slotName);
		});
	}

	addClickTrackingListeners(
		callback: utils.Middleware<ClickPositionContext>,
		slotName: string,
	): void {
		const slot = slotService.get(slotName);
		const iframeElement = slot.getIframe();
		const slotElement = slot.getElement();
		const elementHeight = slotElement.offsetHeight;

		if (!slot || !iframeElement) {
			utils.logger(this.logGroup, `Slot ${slotName} has no iframe.`);
			return;
		}

		if (!typeof iframeElement.contentWindow) {
			utils.logger(this.logGroup, `Slot ${slotName} is served in safeframe.`);
			return;
		}
		const iframeBody = iframeElement.contentWindow.document.body as HTMLElement;

		if (iframeBody && slotElement) {
			slotElement.addEventListener('click', (e: MouseEvent) => {
				const y = e.clientY - window.innerHeight + elementHeight;

				this.handleClickEvent(
					callback,
					{ x: e.clientX, y },
					slotElement.offsetWidth,
					slotElement.offsetHeight,
					'slot',
				);
			});
			iframeBody.addEventListener('click', (e: MouseEvent) => {
				this.handleClickEvent(
					callback,
					{ x: e.clientX, y: e.clientY },
					iframeElement.offsetWidth,
					iframeElement.offsetHeight,
					'iframe',
				);
			});
		}
	}
}

export const clickPositionTracker = new ClickPositionTracker();
