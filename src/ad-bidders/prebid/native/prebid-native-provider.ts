import { communicationService, eventsRepository } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { PrebidNativeData } from './native-models';

const logGroup = 'prebid-native-provider';
const assetsMap = {
	title: 'hb_native_title',
	body: 'hb_native_body',
	image: 'hb_native_image',
	icon: 'hb_native_icon',
	clickUrl: 'hb_native_linkurl',
};

export class PrebidNativeProvider {
	static INCONTENT_AD_SLOT_NAME = 'ntv_ad';

	isEnabled(): boolean {
		return context.get('bidders.prebid.native.enabled');
	}

	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			return;
		}

		communicationService.on(eventsRepository.NO_NATIVO_AD, (payload) => {
			if (payload.slotName != PrebidNativeProvider.INCONTENT_AD_SLOT_NAME) {
				return;
			}

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
		let template = this.getPrebidNativeTemplate();
		for (const assetName in data) {
			template = this.replaceAssetPlaceholderWithData(assetName, data, template);
		}
		return template;
	}

	private replaceAssetPlaceholderWithData(
		assetName: string,
		data: PrebidNativeData,
		template: string,
	): string {
		if (assetsMap[assetName]) {
			const value = this.getAssetValue(assetName, data);
			return template.replace('##' + assetsMap[assetName] + '##', value);
		}
	}

	private getAssetValue(assetName: string, data: PrebidNativeData): string {
		if (assetName == 'icon' || assetName == 'image') {
			return data[assetName]['url'];
		}
		return data[assetName];
	}

	getPrebidNativeTemplate(): string {
		return `<div id="native-prebid-ad" class="ntv-ad">
			<div class="ntv-wrapper">
			<a href="##hb_native_linkurl##" style="flex-shrink: 0;">
			<img src="##hb_native_icon##" class="ntv-img">
			</a>
			<div class="ntv-content">
			<p class="ntv-ad-label">Ad</p>
			<a href="##hb_native_linkurl##">
			<p class="ntv-ad-title ntv-headline">##hb_native_title##</p>
			</a>
			<p class="ntv-ad-offer">##hb_native_body##</p>
			<a href="##hb_native_linkurl##">
			<button class="ntv-ad-button">Check!</button>
			</a>
			</div>
			</div>
			</div>`;
	}
}

export const prebidNativeProvider = new PrebidNativeProvider();
