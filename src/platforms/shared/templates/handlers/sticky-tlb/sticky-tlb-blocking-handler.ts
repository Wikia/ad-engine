import {
	AdSlot,
	babDetection,
	communicationService,
	context,
	eventsRepository,
	TEMPLATE,
	TemplateStateHandler,
	TemplateTransition,
	UapLoadStatus,
	universalAdPackage,
	utils,
} from '@wikia/ad-engine';
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
		if (!this.isStickyTlbForced() && !this.isLineAndGeo() && !this.isOrderAndGeo()) {
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
			return true;
		}

		return map
			.map((element) => element.toString())
			.some((element) => {
				const [mapGamId, geo] = element.split(':', 2);

				return mapGamId.toString() === gamId && (!geo || utils.geoService.isProperGeo([geo]));
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
		utils.logger(StickyTlbBlockingHandler.LOG_GROUP, ...logMsgs);
	}
}
