import { context, postponeExecutionUntilGptLoads, utils } from '@ad-engine/core';

const logGroup = 'ias-publisher-optimization';
const scriptUrl = '//cdn.adsafeprotected.com/iasPET.1.js';

interface IasPetQueueElement {
	adSlots: number[][];
	dataHandler: (string) => void;
}

interface IasPetConfig {
	queue?: IasPetQueueElement[];
	pubId?: string;
}

interface IasTargetingSlotData {
	id?: string;
	vw?: string[];
}

interface IasTargetingData {
	fr?: string;
	slots?: IasTargetingSlotData[];
}

class IasPublisherOptimization {
	private isLoaded = false;
	private slotList: string[] = [];
	private iasPET: IasPetConfig;

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
				.then(postponeExecutionUntilGptLoads(() => this.setup()));
			this.isLoaded = true;
		}
	}

	private setup(): void {
		const iasPETSlots = [];
		// @ts-ignore
		this.iasPET = __iasPET || {};
		this.iasPET.queue = this.iasPET.queue || [];
		this.iasPET.pubId = context.get('services.iasPublisherOptimization.pubId');
		this.slotList = context.get('services.iasPublisherOptimization.slots');
		this.setInitialTargeting();

		this.slotList.forEach((slotName) => {
			const slot = context.get(`slots.${slotName}`);
			const sizes = slot.sizes && slot.sizes.length ? slot.sizes[0].sizes : slot.defaultSizes;
			const adUnitPath = utils.stringBuilder.build(slot.adUnit || context.get('adUnitId'), {
				slotConfig: slot,
			});
			iasPETSlots.push({
				adSlotId: slot['adProduct'],
				size: sizes,
				adUnitPath,
			});
		});

		this.iasPET.queue.push({
			adSlots: iasPETSlots,
			dataHandler: this.iasDataHandler,
		});
	}

	private setInitialTargeting(): void {
		context.set('targeting.fr', '-1');
		this.slotList.forEach((slotName) => {
			context.set(`slots.${slotName}.targeting.vw`, '-1');
		});
	}

	private iasDataHandler(adSlotData: string): void {
		const iasTargetingData: IasTargetingData = JSON.parse(adSlotData);
		context.set('targeting.fr', iasTargetingData.fr);

		for (const [slotName, slotTargeting] of Object.entries(iasTargetingData.slots)) {
			context.set(`slots.${slotName}.targeting.vw`, slotTargeting.vw);
		}
	}
}

export const iasPublisherOptimization = new IasPublisherOptimization();
