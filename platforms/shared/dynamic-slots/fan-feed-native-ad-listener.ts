import { communicationService, eventsRepository, ofType, UapLoadStatus } from '@wikia/ad-engine';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

export function fanFeedNativeAdListener(
	nativeAdInjector: (uapLoadStatusAction: UapLoadStatus) => void,
): void {
	const uap$ = communicationService.action$.pipe(
		ofType(communicationService.getGlobalAction(eventsRepository.AD_ENGINE_UAP_LOAD_STATUS)),
		map(({ isLoaded, adProduct }) => {
			return { isLoaded, adProduct };
		}),
	);

	const fanFeed$ = communicationService.action$.pipe(
		ofType(communicationService.getGlobalAction(eventsRepository.FAN_FEED_READY)),
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
