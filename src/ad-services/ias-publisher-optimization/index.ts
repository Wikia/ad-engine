import { context, postponeExecutionUntilGptLoads, SlotConfig, utils } from '@ad-engine/core';
import { decorate } from 'core-decorators';

const logGroup = 'ias-publisher-optimization';
const scriptUrl = '//cdn.adsafeprotected.com/iasPET.1.js';
const brandSafetyKeys = ['adt', 'alc', 'dlm', 'drg', 'hat', 'off', 'vio'] as const;

type BrandSafetyValue = 'veryLow' | 'low' | 'medium' | 'high';
type BrandSafetyKey = typeof brandSafetyKeys[number];
type BrandSafetyData = Partial<Record<BrandSafetyKey, BrandSafetyValue>>;

interface IasTargetingSlotData {
	id?: string;
	vw?: string[];
	vw_vv: string[];
}

interface IasTargetingData {
	brandSafety?: BrandSafetyData;
	fr?: string;
	slots?: IasTargetingSlotData[];
}

class IasPublisherOptimization {
	private isLoaded = false;
	private slotList: string[] = [];

	private isEnabled(): boolean {
		return (
			context.get('services.iasPublisherOptimization.enabled') &&
			context.get('options.trackingOptIn') &&
			!context.get('options.optOutSale') &&
			!context.get('wiki.targeting.directedAtChildren')
		);
	}

	call(): void {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading');
			utils.scriptLoader
				.loadScript(scriptUrl, 'text/javascript', true, 'first')
				.then(() => this.setup());
			this.isLoaded = true;
		}
	}

	@decorate(postponeExecutionUntilGptLoads)
	private setup(): void {
		const iasPETSlots: IasSlotConfig[] = [];
		this.slotList = context.get('services.iasPublisherOptimization.slots');
		this.setInitialTargeting();

		this.slotList.forEach((slotName) => {
			const slot: SlotConfig = context.get(`slots.${slotName}`);
			const adUnitPath = utils.stringBuilder.build(slot.adUnit || context.get('adUnitId'), {
				slotConfig: slot,
			});
			const config: IasSlotConfig = {
				adUnitPath,
				adSlotId: slotName,
				size: this.getSlotSize(slot),
			};

			if (slot.isVideo) {
				config.type = 'video';
			}

			iasPETSlots.push(config);
		});

		// @ts-ignore
		window.__iasPET = window.__iasPET || {};
		window.__iasPET.queue = window.__iasPET.queue || [];
		window.__iasPET.pubId = context.get('services.iasPublisherOptimization.pubId');
		window.__iasPET.queue.push({
			adSlots: iasPETSlots,
			dataHandler: this.iasDataHandler,
		});
	}

	private getSlotSize(slot: SlotConfig): number[] {
		if (slot.isVideo) {
			return [1, 1];
		}

		return slot.sizes && slot.sizes.length ? slot.sizes[0].sizes : slot.defaultSizes;
	}

	private setInitialTargeting(): void {
		context.set('targeting.fr', '-1');

		brandSafetyKeys.forEach((key) => {
			context.set(`targeting.${key}`, '-1');
		});

		this.slotList.forEach((slotName) => {
			context.set(`slots.${slotName}.targeting.vw`, '-1');
		});
	}

	private iasDataHandler(adSlotData: string): void {
		const iasTargetingData: IasTargetingData = JSON.parse(adSlotData);

		context.set('targeting.fr', iasTargetingData.fr);

		if (iasTargetingData.brandSafety) {
			brandSafetyKeys.forEach((key) => {
				if (iasTargetingData.brandSafety[key]) {
					context.set(`targeting.${key}`, iasTargetingData.brandSafety[key]);
				}
			});
		}

		for (const [slotName, slotTargeting] of Object.entries(iasTargetingData.slots)) {
			context.set(`slots.${slotName}.targeting.vw`, slotTargeting.vw || slotTargeting.vw_vv);
		}
	}
}

export const iasPublisherOptimization = new IasPublisherOptimization();
