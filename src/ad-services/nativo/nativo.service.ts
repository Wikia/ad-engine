import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';
import { NATIVO_FEED_AD_SLOT_NAME, NATIVO_INCONTENT_AD_SLOT_NAME } from './nativo.utils';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo service',
	props<{ isLoaded: boolean }>(),
);

class Nativo {
	private postRelease: NativoPostRelease;

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				utils.logger(logGroup, 'ready');
				this.sendEvent();
				this.postRelease = window.PostRelease;
			});
	}

	start(): void {
		if (utils.queryString.get('native_ads_test') === '1') {
			this.displayTestAd();
		} else {
			this.postRelease.Start();
		}
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({ isLoaded: true }));
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	private displayTestAd(): void {
		const nativeAdIncontentPlaceholder = document.getElementById(NATIVO_INCONTENT_AD_SLOT_NAME);
		nativeAdIncontentPlaceholder.innerHTML = `<div class="ntv-wrapper">
					<img 
						src="https://placekitten.com/100/100" 
						alt="mr. mittens" 
						class="ntv-img" 
					/>
					<div class="ntv-content">
						<p class="ntv-ad-label">AD · best buy</p>
						<p class="ntv-ad-title">Buy Opla: Very good Astra 1.0 TDI</p>
						<p class="ntv-ad-offer">Available from komis for $213.7</p>
						<button class="ntv-ad-button">buy now</button>
					</div>
				</div>`;

		const nativeAdFeedPlaceholder = document.getElementById(NATIVO_FEED_AD_SLOT_NAME);
		nativeAdFeedPlaceholder.innerHTML = `<li class="recirculation-prefooter__item is-sponsored" style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000), url(https://placekitten.com/386/259);">
			<a href="https://bit.ly/NewFanLabRecirc" class="recirculation-prefooter__item-anchor recirculation-prefooter__sponsored ntv-ad-anchor">
				<p class="recirculation-prefooter__personalization wds-font-size-s wds-font-weight-medium wds-leading-tight ntv-ad-label">AD · best buy</p>
				<p class="recirculation-prefooter__title wds-font-size-base wds-font-weight-bold wds-leading-tight ntv-ad-title">Buy Opla: Very good Astra 1.0 TDI</p>
				<p class="recirculation-prefooter__subtitle wds-font-size-s wds-font-weight-medium wds-leading-tight ntv-ad-offer">Available from komis for $213.7</p>
			</a>
		</li>`;
	}
}

export const nativo = new Nativo();
