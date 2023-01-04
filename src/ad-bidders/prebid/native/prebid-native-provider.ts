import { communicationService, eventsRepository } from '@ad-engine/communication';
import { AdSlot, BaseServiceSetup, slotService, utils } from '@ad-engine/core';
import { PrebidNativeData } from './native-models';
import { PrebidNativeConfig } from './prebid-native-config';
import { PrebidNativeHelper } from './prebid-native-helper';

const logGroup = 'prebid-native-provider';

export class PrebidNativeProvider extends BaseServiceSetup {
	static ACTION_CLICK = 'click';
	static ACTION_IMPRESSION = 'impression';

	call() {
		if (!this.isEnabled('bidders.prebid.native.enabled', false)) {
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
		const ntvAdSlot = slotService.get(adSlotName);
		const ntvDomElement = ntvAdSlot.getElement();

		ntvDomElement.insertAdjacentHTML('afterend', this.getNativeAdTemplate(data));
		this.fireNativeTrackers(PrebidNativeProvider.ACTION_IMPRESSION, data);
		this.addClickTrackers(data);

		const currentRv = ntvAdSlot.getTargetingConfigProperty('rv') || 1;
		ntvAdSlot.setTargetingConfigProperty('rv', currentRv + 1);
		ntvAdSlot.setStatus(AdSlot.STATUS_SUCCESS);
	}

	private getNativeAdTemplate(data: PrebidNativeData): string {
		const template = PrebidNativeConfig.getPrebidNativeTemplate();
		return this.replaceAssetPlaceholdersWithData(template, data);
	}

	replaceAssetPlaceholdersWithData(template: string, data: PrebidNativeData): string {
		for (const assetName in data) {
			if (PrebidNativeConfig.assetsMap[assetName]) {
				const value = this.getAssetValue(assetName, data);
				template = template
					.split('##' + PrebidNativeConfig.assetsMap[assetName] + '##')
					.join(value);
			}
		}

		if (template.includes('##hb_native_image##')) {
			template = this.removeImgFromTemplate(template);
		}
		if (template.includes('##hb_native_displayUrl##')) {
			template = this.replaceDisplayUrlWithDefaultText(template);
		}

		return template;
	}

	private removeImgFromTemplate(template: string): string {
		const emptyImgTag = /<img [^>]*src="##hb_native_image##"[^>]*>/gm;
		return template.split(emptyImgTag).join('');
	}

	private replaceDisplayUrlWithDefaultText(template: string): string {
		return template.split('##hb_native_displayUrl##').join('See more');
	}

	private getAssetValue(assetName: string, data: PrebidNativeData): string {
		if (assetName == 'icon' || assetName == 'image') {
			return data[assetName]['url'];
		}
		return data[assetName];
	}

	private fireNativeTrackers(action: string, adObject: PrebidNativeData): void {
		let trackers;
		if (action === PrebidNativeProvider.ACTION_CLICK) {
			trackers = adObject && adObject.clickTrackers;
		}
		if (action === PrebidNativeProvider.ACTION_IMPRESSION) {
			trackers = adObject && adObject.impressionTrackers;
		}

		(trackers || []).forEach(PrebidNativeHelper.triggerPixel);
	}

	private addClickTrackers(adObject: PrebidNativeData): void {
		const nativeAdElement = document.getElementById('native-prebid-ad');
		const linkElements = nativeAdElement.getElementsByClassName('ntv-link');

		[].slice.call(linkElements).forEach((element) => {
			element.addEventListener('click', () => {
				this.fireNativeTrackers(PrebidNativeProvider.ACTION_CLICK, adObject);
			});
		});
	}
}

export const prebidNativeProvider = new PrebidNativeProvider();
