import { utils } from '@ad-engine/core';

export class PrebidNativeConfig {
	static getPrebidNativeMediaTypes(deviceType: string): PrebidNativeMediaType {
		return {
			sendTargetingKeys: false,
			adTemplate: PrebidNativeConfig.getPrebidNativeTemplate(),
			title: {
				required: true,
				len: PrebidNativeConfig.getMaxTitleLength(deviceType),
			},
			body: {
				required: true,
				len: PrebidNativeConfig.getMaxBodyLength(deviceType),
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
						min_width: PrebidNativeConfig.getMinImageSize(deviceType),
						min_height: PrebidNativeConfig.getMinImageSize(deviceType),
						ratio_width: 1,
						ratio_height: 1,
					},
				],
			},
		};
	}

	static getPrebidNativeTemplate(): string {
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

	private static getMinImageSize(deviceType: string): number {
		// NOTE: Values are based on Nativo image sizes to keep the consistency
		if (deviceType == 'mobile') {
			if (utils.getViewportWidth() <= 320) {
				return 90;
			}
			return 120;
		}
		return 126;
	}

	private static getMaxTitleLength(deviceType: string): number {
		return deviceType == 'mobile' ? 40 : 60;
	}

	private static getMaxBodyLength(deviceType: string): number {
		return deviceType == 'mobile' ? 30 : 120;
	}
}
