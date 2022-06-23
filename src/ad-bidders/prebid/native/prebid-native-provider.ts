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
		const template = this.getPrebidNativeTemplate();
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

	getPrebidNativeMediaTypes(position: string): PrebidNativeMediaType {
		return {
			sendTargetingKeys: false,
			adTemplate: this.getPrebidNativeTemplate(),
			title: {
				required: true,
				len: this.getMaxTitleLength(position),
			},
			body: {
				required: true,
				len: this.getMaxBodyLength(position),
			},
			clickUrl: {
				required: true,
			},
			displayUrl: {
				required: true,
			},
			image: {
				required: true,
				aspect_ratios: [
					{
						min_width: this.getMinImageSize(position),
						min_height: this.getMinImageSize(position),
						ratio_width: 1,
						ratio_height: 1,
					},
				],
			},
		};
	}

	getPrebidNativeTemplate(): string {
		return `<div id="native-prebid-ad" class="ntv-ad">
					<div class="ntv-wrapper">
						<a href="##hb_native_linkurl##" style="flex-shrink: 0;">
							<img src="##hb_native_image##" class="ntv-img">
						</a>
						<div class="ntv-content">
							<p class="ntv-ad-label">Ad</p>
							<a href="##hb_native_linkurl##">
								<p class="ntv-ad-title ntv-headline">##hb_native_title##</p>
							</a>
							<p class="ntv-ad-offer">##hb_native_body##</p>
							<a href="##hb_native_linkurl##">
								<button class="ntv-ad-button">##hb_native_displayUrl##</button>
							</a>
						</div>
					</div>
				</div>`;
	}

	getMinImageSize(position: string): number {
		// NOTE: Values are based on Nativo image sizes to keep the consistency
		if (position == 'mobile') {
			if (utils.getViewportWidth() <= 320) {
				return 90;
			}
			return 120;
		}
		return 126;
	}

	getMaxTitleLength(position: string): number {
		return position == 'mobile' ? 40 : 60;
	}

	getMaxBodyLength(position: string): number {
		return position == 'mobile' ? 30 : 120;
	}
}

export const prebidNativeProvider = new PrebidNativeProvider();
