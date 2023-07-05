import { AdSlot, context } from '@wikia/ad-engine';

export class StickyTlbAllowanceExaminer {
	constructor(private adSlot: AdSlot) {}

	public shouldStick(): boolean {
		return this.isStickyTlbForced() || this.isLineAndGeo() || this.isOrderAndGeo();
	}

	private isStickyTlbForced(): boolean {
		return context.get('templates.stickyTlb.forced');
	}

	private isLineAndGeo(): boolean {
		const lines: string[] = context.get('templates.stickyTlb.lineItemIds') || [];

		return this.checkIdsMapBySlotGamId(this.adSlot.lineItemId.toString(), lines);
	}

	private isOrderAndGeo(): boolean {
		const orders: string[] = context.get('templates.stickyTlb.ordersIds') || [];

		return this.checkIdsMapBySlotGamId(this.adSlot.orderId.toString(), orders);
	}

	private checkIdsMapBySlotGamId(gamId: string, map: string[]): boolean {
		if (!Array.isArray(map)) {
			return false;
		}

		return map
			.map((element) => element.toString())
			.some((element) => {
				return element.toString() === gamId;
			});
	}
}
