import {
	AdSlot,
	BaseServiceSetup,
	communicationService,
	context,
	eventsRepository,
	PrebidNativeConfig,
	PrebidNativeHelper,
	slotService,
	utils,
} from '@wikia/ad-engine';
// eslint-disable-next-line no-restricted-imports
import { PrebidNativeData } from '../../../src/ad-bidders/prebid/native/native-models';

const logGroup = 'prebid-native-provider';

class PrebidNativeProvider {
	static ACTION_CLICK = 'click';
	static ACTION_IMPRESSION = 'impression';
}

class PrebidNativeProviderSetup extends BaseServiceSetup {
	isEnabled(): boolean {
		return context.get('bidders.prebid.native.enabled');
	}

	initialize() {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
		} else {
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
		this.res();
	}

	renderPrebidNativeAd(adSlotName: string, data: PrebidNativeData): void {
		const ntvAdSlot = slotService.get(adSlotName);

		const ntvDomElement = ntvAdSlot.getElement();
		ntvDomElement.insertAdjacentHTML('afterend', this.getNativeAdTemplate(data));
		this.fireNativeTrackers(PrebidNativeProvider.ACTION_IMPRESSION, data);
		this.addClickTrackers(data);

		const currentRv = ntvAdSlot.getConfigProperty('targeting.rv') || 1;
		ntvAdSlot.setConfigProperty('targeting.rv', currentRv + 1);
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
		return template;
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

export const prebidNativeProviderSetup = new PrebidNativeProviderSetup();
