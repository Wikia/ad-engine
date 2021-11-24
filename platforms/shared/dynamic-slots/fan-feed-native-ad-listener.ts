import { communicationService, globalAction, ofType, uapLoadStatus } from '@wikia/ad-engine';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const fanFeedReady = globalAction('[FanFeed] Ready');

export function fanFeedNativeAdListener(nativeAdInjector: () => void): void {
	const uap$ = communicationService.action$.pipe(
		ofType(uapLoadStatus),
		map(({ isLoaded }) => isLoaded),
	);

	const fanFeed$ = communicationService.action$.pipe(
		ofType(fanFeedReady),
		map(() => true),
	);

	combineLatest([uap$, fanFeed$])
		.pipe(map(([uapLoaded, fanFeedLoaded]) => !(uapLoaded && fanFeedLoaded)))
		.subscribe((shouldRenderNativeAd) => {
			if (shouldRenderNativeAd) {
				nativeAdInjector();
			}
		});
}
