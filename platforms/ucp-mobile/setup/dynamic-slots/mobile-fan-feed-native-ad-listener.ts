import { fanFeedNativeAdListener } from '@platforms/shared';
import { nativo } from '@wikia/ad-engine';

export function mobileFanFeedNativeAdListener(): void {
	fanFeedNativeAdListener((uapLoadStatusAction: any = {}) =>
		nativo.replaceAndShowSponsoredFanAd(uapLoadStatusAction),
	);
}
