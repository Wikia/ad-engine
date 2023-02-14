import {
	AdSlot,
	communicationService,
	context,
	DiProcess,
	eventsRepository,
	SlotTargeting,
	targetingService,
	utils,
} from '@wikia/ad-engine';
import { injectable } from 'tsyringe';

const logGroup = 'layout-initializer';

type LayoutPayload = {
	layout: string;
	data: any;
};

interface FanTakeoverLayoutPayload extends LayoutPayload {
	data: {
		// ToDo: possibly change to impressionMacro in order to be consistent with GAM docs WARNING! changing it here requires changes in GAM templates for existing LIS campaigns
		impression: string;
		lineItemId: string;
		creativeId: string;
	};
	ntc?: boolean;
}

export function shouldUseAdLayouts(): Promise<boolean> {
	return new AdLayoutInitializerSetup()
		.execute()
		.then(() => true)
		.catch(() => false);
}

@injectable()
export class AdLayoutInitializerSetup implements DiProcess {
	private lisAdUnit = '/5441/wka1b.LIS/layout_initializer/';
	private lisSize = '1x1';
	private lisTargeting: SlotTargeting = {
		loc: 'pre',
		pos: 'layout_initializer',
	};

	async execute(): Promise<void> {
		if (!context.get('options.initCall')) {
			utils.logger(logGroup, 'LIS call disabled');

			return Promise.reject();
		}

		const lisUrl = utils.buildTaglessRequestUrl({
			adUnit: this.lisAdUnit,
			size: this.lisSize,
			targeting: {
				...targetingService.dump(),
				...this.lisTargeting,
				src: context.get('src'),
			},
		});

		utils.logger(logGroup, 'LIS URL built: ', lisUrl);

		await utils.scriptLoader.loadAsset(lisUrl, 'text').then((response) => {
			if (!response) {
				return Promise.reject();
			}

			try {
				const layoutPayload: LayoutPayload = JSON.parse(response);

				utils.logger(logGroup, 'Layout payload received', layoutPayload);

				// ToDo: move the logic below to UapAdLayout
				if (['uap', 'jwplayer'].includes(layoutPayload.layout)) {
					const ftlPayload = layoutPayload as FanTakeoverLayoutPayload;
					const slotName = layoutPayload.layout === 'uap' ? 'top_leaderboard' : 'featured';

					this.setupImpressionTrigger(slotName, ftlPayload.data.impression);
					this.setFanTakeoverTargeting(ftlPayload.data.lineItemId, ftlPayload.data.creativeId);

					if (ftlPayload.ntc) {
						communicationService.emit(eventsRepository.AD_ENGINE_UAP_NTC_LOADED);
					}

					return Promise.resolve();
				}

				return Promise.reject();
			} catch (e) {
				return Promise.reject();
			}
		});
	}

	private setupImpressionTrigger(impressionSlot: string, pixel: string): void {
		const impressionCallback = () => {
			utils.scriptLoader.loadAsset(pixel, 'blob');
		};

		communicationService.onSlotEvent(
			AdSlot.STATUS_SUCCESS,
			impressionCallback,
			impressionSlot,
			true,
		);
	}

	private setFanTakeoverTargeting(lineItemId: string, creativeId: string): void {
		targetingService.set('uap', lineItemId);
		targetingService.set('uap_c', creativeId);
	}
}
