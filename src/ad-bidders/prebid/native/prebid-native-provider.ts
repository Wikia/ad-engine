import { communicationService, eventsRepository } from '@ad-engine/communication';
import { PrebidNativeData } from './native-models';

export class PrebidNativeProvider {
	initialize() {
		communicationService.on(eventsRepository.NO_NATIVO_AD, (payload) => {
			const data = window.pbjs.getHighestUnusedBidResponseForAdUnitCode(payload.slotName);
			console.log('prebid native', 'NO_NATIVO_AD payload', payload);
			console.log('prebid native', 'NO_NATIVO_AD data', data);
			if (data.native) {
				this.renderPrebidNativeAd(payload.slotName, data.native);
			}
			communicationService.emit(eventsRepository.NO_NATIVE_PREBID_AD, {
				slotName: payload.slotName,
			});
		});
	}

	private renderPrebidNativeAd(adSlotName: string, data: PrebidNativeData): void {
		const ntvAdSLot = document.getElementById(adSlotName);
		ntvAdSLot.insertAdjacentHTML('afterend', this.getNativeAdTemplate(data));
	}

	private getNativeAdTemplate(data: PrebidNativeData): string {
		let template = this.getPrebidNativeTemplate();
		const assetsMap = {
			title: 'hb_native_title',
			body: 'hb_native_body',
			image: 'hb_native_image',
			icon: 'hb_native_icon',
			clickUrl: 'hb_native_linkurl',
		};

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

	getPrebidNativeTemplate(): string {
		return (
			'<div id="native-prebid-ad" class="ntv-ad">' +
			'<div class="ntv-wrapper">' +
			'<a href="##hb_native_linkurl##" style="flex-shrink: 0;">' +
			'<img src="##hb_native_icon##" class="ntv-img">' +
			'</a>' +
			'<div class="ntv-content">' +
			'<p class="ntv-ad-label">Ad</p>' +
			'<a href="##hb_native_linkurl##">' +
			'<p class="ntv-ad-title ntv-headline">##hb_native_title##</p>' +
			'</a>' +
			'<p class="ntv-ad-offer">##hb_native_body##</p>' +
			'<a href="##hb_native_linkurl##">' +
			'<button class="ntv-ad-button">Check!</button>' +
			'</a>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
	}
}

export const prebidNativeProvider = new PrebidNativeProvider();
