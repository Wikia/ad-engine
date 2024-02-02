import { getViewportWidth } from '@ad-engine/utils';

export class PrebidNativeConfig {
	static assetsMap = {
		title: 'hb_native_title',
		body: 'hb_native_body',
		image: 'hb_native_image',
		clickUrl: 'hb_native_linkurl',
		displayUrl: 'hb_native_displayUrl',
	};

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
				required: false,
			},
			image: {
				required: false,
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
						<a href="##hb_native_linkurl##" class="ntv-link" style="flex-shrink: 0;">
							<img src="##hb_native_image##" id="ntv-img" class="ntv-img">
						</a>
						<div class="ntv-content">
							<p class="ntv-ad-label">Ad</p>
							<a href="##hb_native_linkurl##" class="ntv-link">
								<p class="ntv-ad-title ntv-headline">##hb_native_title##</p>
							</a>
							<p class="ntv-ad-offer">##hb_native_body##</p>
							<a href="##hb_native_linkurl##" class="ntv-link">
								<button class="ntv-ad-button">##hb_native_displayUrl##</button>
							</a>
						</div>
					</div>
				</div>`;
	}

	private static getMinImageSize(deviceType: string): number {
		// NOTE: Values are based on Nativo image sizes to keep the consistency
		if (deviceType == 'mobile') {
			if (getViewportWidth() <= 320) {
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
