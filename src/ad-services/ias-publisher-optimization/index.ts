import { context, postponeExecutionUntilGptLoads, utils } from '@ad-engine/core';
import { decorate } from 'core-decorators';

const logGroup = 'ias-publisher-optimization';
const scriptUrl = '//cdn.adsafeprotected.com/iasPET.1.js';
const brandSafetyKeys = ['adt', 'alc', 'dlm', 'drg', 'hat', 'off', 'vio'];

type BrandSafetyValue = 'veryLow' | 'low' | 'medium' | 'high';

interface BrandSafetyData {
	adt?: BrandSafetyValue;
	alc?: BrandSafetyValue;
	dlm?: BrandSafetyValue;
	drg?: BrandSafetyValue;
	hat?: BrandSafetyValue;
	off?: BrandSafetyValue;
	vio?: BrandSafetyValue;
}

interface IasTargetingSlotData {
	id?: string;
	vw?: string[];
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
		return context.get('services.iasPublisherOptimization.enabled');
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
		const iasPETSlots = [];
		this.slotList = context.get('services.iasPublisherOptimization.slots');
		this.setInitialTargeting();

		this.slotList.forEach((slotName) => {
			const slot = context.get(`slots.${slotName}`);
			const sizes = slot.sizes && slot.sizes.length ? slot.sizes[0].sizes : slot.defaultSizes;
			const adUnitPath = utils.stringBuilder.build(slot.adUnit || context.get('adUnitId'), {
				slotConfig: slot,
			});
			iasPETSlots.push({
				adSlotId: slotName,
				size: sizes,
				adUnitPath,
			});
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
			context.set(`slots.${slotName}.targeting.vw`, slotTargeting.vw);
		}
	}
}

export const iasPublisherOptimization = new IasPublisherOptimization();
