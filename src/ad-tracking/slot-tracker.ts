import { AdSlot, context, eventService, utils } from '@ad-engine/core';

export interface AdInfoContext {
	data: any;
	slot: AdSlot;
}

class SlotTracker {
	onRenderEndedStatusToTrack = [
		AdSlot.STATUS_COLLAPSE,
		AdSlot.STATUS_FORCED_COLLAPSE,
		AdSlot.STATUS_SUCCESS,
	];
	onChangeStatusToTrack = [
		AdSlot.STATUS_BLOCKED,
		AdSlot.STATUS_ERROR,
		AdSlot.STATUS_VIEWPORT_CONFLICT,
		AdSlot.STATUS_HIVI_COLLAPSE,
		AdSlot.STATUS_CLOSED_BY_PORVATA,
	];

	private middlewareService = new utils.MiddlewareService<AdInfoContext>();

	add(middleware: utils.Middleware<AdInfoContext>): this {
		this.middlewareService.add(middleware);

		return this;
	}

	isEnabled(): boolean {
		return context.get('options.tracking.slot.status');
	}

	register(callback: utils.Middleware<AdInfoContext>): void {
		if (!this.isEnabled()) {
			return;
		}

		eventService.on(AdSlot.SLOT_RENDERED_EVENT, (slot: AdSlot) => {
			const status = slot.getStatus();
			const middlewareContext: AdInfoContext = {
				slot,
				data: {},
			};

			if (
				this.onRenderEndedStatusToTrack.includes(status) ||
				slot.getConfigProperty('trackEachStatus')
			) {
				this.middlewareService.execute(middlewareContext, callback);
			} else if (slot.getStatus() === 'manual') {
				slot.trackOnStatusChanged = true;
			}
		});

		eventService.on(AdSlot.SLOT_STATUS_CHANGED, (slot: AdSlot) => {
			const status = slot.getStatus();
			const shouldSlotBeTracked =
				slot.getConfigProperty('trackEachStatus') || slot.trackOnStatusChanged;
			const middlewareContext: AdInfoContext = {
				slot,
				data: {},
			};

			if (this.onChangeStatusToTrack.includes(status) || shouldSlotBeTracked) {
				this.middlewareService.execute(middlewareContext, callback);
				delete slot.trackOnStatusChanged;
			}
		});

		eventService.on(AdSlot.CUSTOM_EVENT, (slot: AdSlot, { status }: { status: string }) => {
			const middlewareContext: AdInfoContext = {
				slot,
				data: {
					ad_status: status,
				},
			};

			this.middlewareService.execute(middlewareContext, callback);
		});
	}
}

export const slotTracker = new SlotTracker();
