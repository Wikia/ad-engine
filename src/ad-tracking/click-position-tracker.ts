import { AdSlot, context, slotService, utils } from '@ad-engine/core';

export interface ClickPositionContext {
	data: any;
}

class ClickPositionTracker {
	private middlewareService = new utils.MiddlewareService<ClickPositionContext>();

	add(middleware: utils.Middleware<ClickPositionContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	handleClickEvent(
		callback: utils.Middleware<ClickPositionContext>,
		event: MouseEvent,
		slotWidth: number,
		slotHeight: number,
	): void {
		const y = event.clientY - window.innerHeight + slotHeight;
		this.middlewareService.execute(
			{
				data: {
					category: 'click_position',
					action: 'click',
					label: `size=${slotWidth}x${slotHeight}|x=${event.clientX}|y=${y}`,
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
		const adUnit = utils.stringBuilder.build(context.get('adUnitId'), {
			...context,
			slotConfig: context.get(`slots.${slotName}`),
		});
		const slot = document.getElementById(slotName);
		const iframeId = `google_ads_iframe_${adUnit}_0`;
		const iframeWrapper = document.getElementById(iframeId) as HTMLIFrameElement;
		const iframe = iframeWrapper.contentWindow.document.body as HTMLElement;

		if (iframeWrapper && iframe) {
			iframeWrapper.addEventListener('click', (e) =>
				this.handleClickEvent(callback, e, slot.offsetWidth, slot.offsetHeight),
			);
			iframe.addEventListener('click', (e) =>
				this.handleClickEvent(callback, e, slot.offsetWidth, slot.offsetHeight),
			);
		}
	}
}

export const clickPositionTracker = new ClickPositionTracker();
