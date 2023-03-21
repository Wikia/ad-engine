import {
	BaseServiceSetup,
	context,
	Dictionary,
	SlotConfig,
	targetingService,
	utils,
} from '@ad-engine/core';

const logGroup = 'ias-publisher-optimization';
const scriptUrl = '//cdn.adsafeprotected.com/iasPET.1.js';
const pubId = '930616';
const brandSafetyKeys = ['adt', 'alc', 'dlm', 'drg', 'hat', 'off', 'vio'] as const;
const brandSafetyValuesLevel: Dictionary<number> = {
	veryLow: 1,
	low: 2,
	medium: 3,
	high: 4,
};

type BrandSafetyValue = 'veryLow' | 'low' | 'medium' | 'high';
type BrandSafetyKey = (typeof brandSafetyKeys)[number];
type BrandSafetyData = Partial<Record<BrandSafetyKey, BrandSafetyValue>>;

interface IasTargetingSlotData {
	id?: string;
	vw?: string[];
	vw_vv: string[];
}

interface IasCustomData {
	'ias-kw': string[];
}

interface IasTargetingData {
	brandSafety?: BrandSafetyData;
	custom: IasCustomData;
	fr?: string;
	slots?: IasTargetingSlotData[];
}

export class IasPublisherOptimization extends BaseServiceSetup {
	private isLoaded = false;
	private slotList: string[] = [];

	private resolveIASReady: () => void;
	IASReady: Promise<void> = new Promise<void>((resolve) => {
		this.resolveIASReady = resolve;
	});

	call(): Promise<void> {
		if (!this.isEnabled('icIASPublisherOptimization')) {
			utils.logger(logGroup, 'disabled');
			return Promise.resolve();
		}

		if (!this.isLoaded) {
			utils.logger(logGroup, 'loading...');
			this.isLoaded = true;
			return utils.scriptLoader.loadScript(scriptUrl, 'text/javascript', true, 'first').then(() => {
				utils.logger(logGroup, 'asset loaded');
				this.setup();
			});
		}
	}

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

		window.__iasPET = window.__iasPET || {};
		window.__iasPET.queue = window.__iasPET.queue || [];
		window.__iasPET.pubId = pubId;
		window.__iasPET.queue.push({
			adSlots: iasPETSlots,
			dataHandler: this.iasDataHandler.bind(this),
		});
	}

	private getSlotSize(slot: SlotConfig): number[] {
		if (slot.isVideo) {
			return [1, 1];
		}

		return slot.sizes && slot.sizes.length ? slot.sizes[0].sizes : slot.defaultSizes;
	}

	private setInitialTargeting(): void {
		utils.logger(logGroup, 'setting initial targeting...');

		targetingService.set('fr', '-1');
		targetingService.set('b_ias', '-1');
		targetingService.set('ias-kw', '-1');

		brandSafetyKeys.forEach((key) => {
			targetingService.set(key, '-1');
		});

		this.slotList.forEach((slotName) => {
			targetingService.set('vw', '-1', slotName);
		});
	}

	private iasDataHandler(adSlotData: string): void {
		utils.logger(logGroup, 'handling IAS response...');

		const iasTargetingData: IasTargetingData = JSON.parse(adSlotData);

		targetingService.set('fr', iasTargetingData.fr);

		IasPublisherOptimization.setBrandSafetyKeyValuesInTargeting(iasTargetingData.brandSafety);
		IasPublisherOptimization.setCustomKeyValuesInTargeting(iasTargetingData.custom);

		for (const [slotName, slotTargeting] of Object.entries(iasTargetingData.slots)) {
			targetingService.set('vw', slotTargeting.vw || slotTargeting.vw_vv, slotName);
		}
		utils.logger(logGroup, 'Done.', this);
		this.resolveIASReady();
	}

	private static setBrandSafetyKeyValuesInTargeting(brandSafetyData): void {
		if (!brandSafetyData) {
			utils.logger(logGroup, 'no brand safety data');
			return;
		}

		let maxValue = '-1';

		brandSafetyKeys.forEach((key) => {
			if (brandSafetyData[key]) {
				targetingService.set(key, brandSafetyData[key]);

				if (
					maxValue === '-1' ||
					brandSafetyValuesLevel[maxValue] < brandSafetyValuesLevel[brandSafetyData[key]]
				) {
					maxValue = brandSafetyData[key];
				}
			}
		});

		targetingService.set('b_ias', maxValue);
	}

	private static setCustomKeyValuesInTargeting(customData): void {
		if (!customData['ias-kw']) {
			utils.logger(logGroup, 'no custom data');
			return;
		}

		targetingService.set('ias-kw', customData['ias-kw']);
	}
}
