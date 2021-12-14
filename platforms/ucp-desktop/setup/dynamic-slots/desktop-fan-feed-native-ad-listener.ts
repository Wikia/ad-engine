import { fanFeedNativeAdListener } from '@platforms/shared';
import { Nativo, nativo } from '@wikia/ad-engine';

export function desktopFanFeedNativeAdListener(): void {
	fanFeedNativeAdListener((uapLoadStatusAction: any = {}) =>
		nativo.requestAd(document.getElementById(Nativo.FEED_AD_SLOT_NAME), uapLoadStatusAction),
	);
}
