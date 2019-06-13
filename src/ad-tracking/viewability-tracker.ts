import { AdSlot, context, eventService, utils } from '@wikia/ad-engine';

export interface AdViewabilityContext {
	data: any;
	slot: AdSlot;
}

class ViewabilityTracker {
	middlewareService = new utils.MiddlewareService();

	add(middleware: utils.Middleware<AdViewabilityContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.viewability');
	}

	register(callback: utils.Middleware<AdViewabilityContext>): void {
		if (!this.isEnabled()) {
			return;
		}

		eventService.on(AdSlot.SLOT_VIEWED_EVENT, (slot: AdSlot) => {
			this.middlewareService.execute(
				{
					data: {},
					slot,
				},
				callback,
			);
		});
	}
}

export const viewabilityTracker = new ViewabilityTracker();
