import { context, utils } from '@ad-engine/core';

const logGroup = 'ias-publisher-optimization';
const scriptUrl = '//cdn.adsafeprotected.com/iasPET.1.js';
const SLOT_LIST = [
	'hivi_leaderboard',
	'top_leaderboard',
	'top_boxad',
	'incontent_boxad_1',
	'bottom_leaderboard',
];

interface IasPetConfig {
	queue?: IasPetQueueElement[];
	pubId?: string;
}

interface IasPetQueueElement {
	adSlots: number[][];
	dataHandler: (string) => void;
}

interface IasTargetingData {
	fr?: string;
	slots?: any[];
}

class IasPublisherOptimization {
	private isLoaded = false;
	private iasPET: IasPetConfig;

	private isEnabled(): boolean {
		return context.get('services.iasPublisherOptimization.enabled');
	}

	load(): void {
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

	private setup(): void {
		// @ts-ignore
		this.iasPET = __iasPET || {};
		this.iasPET.queue = this.iasPET.queue || [];
		this.iasPET.pubId = '930616';
		this.setInitialTargeting();

		window.googletag.cmd.push(() => {
			const slots = [];
			const iasPETSlots = [];
			SLOT_LIST.forEach((slotName) => {
				slots.push(context.get(`slots.${slotName}`));
			});

			slots.forEach((slot) => {
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
		});
	}

	private setInitialTargeting(): void {
		context.set('targeting.fr', -1);
		SLOT_LIST.forEach((slotName) => {
			context.set(`slots.${slotName}.targeting.vw`, -1);
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
