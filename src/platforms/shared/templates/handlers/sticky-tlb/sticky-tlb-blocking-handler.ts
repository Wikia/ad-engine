import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import {
	AdSlot,
	babDetection,
	context,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
} from '@ad-engine/core';
import { logger } from '@ad-engine/utils';
import { universalAdPackage } from '@wikia/ad-products';

import { Inject, Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class StickyTlbBlockingHandler implements TemplateStateHandler {
	static LOG_GROUP = 'sticky-tlb';

	constructor(@Inject(TEMPLATE.SLOT) private adSlot: AdSlot) {}

	async onEnter(transition: TemplateTransition<'initial'>): Promise<void> {
		const isUap = await this.isUAP();
		if (isUap) {
			this.blockStickyTLB('UAP');
			return;
		}
		if (!this.isStickyTlbForced() && !this.enabledByLine() && !this.enabledByOrder()) {
			this.blockStickyTLB(`Line item ID ${this.adSlot.lineItemId}`);
			return;
		}
		if (babDetection.isBlocking()) {
			this.blockStickyTLB('AdBlock');
			return;
		}

		transition('initial');
	}

	private blockStickyTLB(reason: string): void {
		this.adSlot.emitEvent(universalAdPackage.SLOT_STICKINESS_DISABLED);
		this.logger(`Template 'stickyTlb' could not be applied for ${reason}`);
	}

	private enabledByLine(): boolean {
		const lines: string[] = context.get('templates.stickyTlb.lineItemIds') || [];

		return this.checkRolloutVariable(this.adSlot.lineItemId, lines);
	}

	private enabledByOrder(): boolean {
		const orders: string[] = context.get('templates.stickyTlb.ordersIds') || [];

		return this.checkRolloutVariable(this.adSlot.orderId, orders);
	}

	private checkRolloutVariable(gamId: string | number, enabledIds: string[]): boolean {
		if (!gamId || !enabledIds || !Array.isArray(enabledIds)) {
			return false;
		}

		return enabledIds.some((id) => {
			return id.toString() === gamId.toString();
		});
	}

	private async isUAP(): Promise<boolean> {
		return new Promise((resolve) => {
			communicationService.on(
				eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
				(action: UapLoadStatus) => {
					resolve(action.isLoaded);
				},
			);
		});
	}

	private isStickyTlbForced(): boolean {
		return context.get('templates.stickyTlb.forced');
	}

	private logger(...logMsgs: any): void {
		logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
