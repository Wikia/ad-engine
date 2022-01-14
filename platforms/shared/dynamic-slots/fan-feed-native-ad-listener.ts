import { communicationService, globalAction, ofType, uapLoadStatus } from '@wikia/ad-engine';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const fanFeedReady = globalAction('[FanFeed] Ready');

export function fanFeedNativeAdListener(
	nativeAdInjector: (uapLoadStatusAction: any) => void,
): void {
	const uap$ = communicationService.action$.pipe(
		ofType(uapLoadStatus),
		map(({ isLoaded, adProduct }) => {
			return { isLoaded, adProduct };
		}),
	);

	const fanFeed$ = communicationService.action$.pipe(
		ofType(fanFeedReady),
		map(() => true),
	);

	combineLatest([uap$, fanFeed$])
		.pipe(
			map(([uapLoadStatusAction, fanFeedLoaded]) => {
				return {
					uapLoadStatusAction,
					shouldRenderNativeAd: !(uapLoadStatusAction.isLoaded && fanFeedLoaded),
				};
			}),
		)
		.subscribe((result) => {
			if (result.shouldRenderNativeAd) {
				nativeAdInjector(result.uapLoadStatusAction);
			}
		});
}
