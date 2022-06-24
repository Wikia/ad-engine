import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { PrebidNativeData } from './native-models';
import { PrebidNativeConfig } from './prebid-native-config';

const logGroup = 'prebid-native-provider';
const assetsMap = {
	title: 'hb_native_title',
	body: 'hb_native_body',
	image: 'hb_native_image',
	icon: 'hb_native_icon',
	clickUrl: 'hb_native_linkurl',
	displayUrl: 'hb_native_displayUrl',
};

export class PrebidNativeProvider {
	isEnabled(): boolean {
		return context.get('bidders.prebid.native.enabled');
	}

	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(eventsRepository.NO_NATIVO_AD, (payload) => {
			const data = window.pbjs.getHighestUnusedBidResponseForAdUnitCode(payload.slotName);
			if (data.native) {
				this.renderPrebidNativeAd(payload.slotName, data.native);
			} else {
				communicationService.emit(eventsRepository.NO_NATIVE_PREBID_AD, {
					slotName: payload.slotName,
				});
			}
		});
	}

	renderPrebidNativeAd(adSlotName: string, data: PrebidNativeData): void {
		const ntvAdSlot = document.getElementById(adSlotName);
		ntvAdSlot.insertAdjacentHTML('afterend', this.getNativeAdTemplate(data));
	}

	private getNativeAdTemplate(data: PrebidNativeData): string {
		const template = PrebidNativeConfig.getPrebidNativeTemplate();
		return this.replaceAssetPlaceholdersWithData(template, data);
	}

	private replaceAssetPlaceholdersWithData(template: string, data: PrebidNativeData): string {
		for (const assetName in data) {
			if (assetsMap[assetName]) {
				const value = this.getAssetValue(assetName, data);
				template = template.replace('##' + assetsMap[assetName] + '##', value);
			}
		}
		return template;
	}

	private getAssetValue(assetName: string, data: PrebidNativeData): string {
		if (assetName == 'icon' || assetName == 'image') {
			return data[assetName]['url'];
		}
		return data[assetName];
	}
}

export const prebidNativeProvider = new PrebidNativeProvider();
