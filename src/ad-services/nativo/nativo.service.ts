import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';
import { logger } from '../../ad-engine/utils';
import { NATIVO_FEED_AD_SLOT_NAME, NATIVO_INCONTENT_AD_SLOT_NAME } from './nativo.utils';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo loaded',
	props<{ isLoaded: boolean }>(),
);

class Nativo {
	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		window.ntv = window.ntv || {};
		window.ntv.cmd = window.ntv.cmd || [];

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				utils.logger(logGroup, 'ready');
				this.sendEvent();
			});
	}

	requestAd(): void {
		if (utils.queryString.get('native_ads_test') === '1') {
			utils.logger(logGroup, 'Displaying dummy test ads');
			this.displayTestAd();
		} else {
			utils.logger(logGroup, 'Sending an ad request to Nativo');
			window.ntv.cmd.push(() => {
				window.PostRelease.Start();
			});
		}
	}

	replaceSponsoredFanFeedAd(): void {
		const nativoFeedAdSlotElement = document.querySelector(`#${NATIVO_FEED_AD_SLOT_NAME}`);
		const recirculationSponsoredElement = document.querySelector(
			'.recirculation-prefooter .recirculation-prefooter__item.is-sponsored',
		);

		if (nativoFeedAdSlotElement && recirculationSponsoredElement) {
			recirculationSponsoredElement.replaceWith(nativoFeedAdSlotElement);
			this.requestAd();
		} else {
			utils.logger(logGroup, 'Could not replace sponsored element with Nativo feed ad');
		}
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({ isLoaded: true }));
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	private displayTestAd(): void {
		if (utils.queryString.get('native_ads_test') !== '1') {
			return;
		}

		this.nativeIncontentTestDummy();
		this.nativeFanFeedAdTestDummy();
	}

	private nativeFanFeedAdTestDummy(): void {
		const nativeAdFeedPlaceholder = document.getElementById(NATIVO_FEED_AD_SLOT_NAME);

		if (nativeAdFeedPlaceholder) {
			nativeAdFeedPlaceholder.innerHTML = `<a href="https://bit.ly/NewFanLabRecirc" class="recirculation-prefooter__item-anchor recirculation-prefooter__sponsored mcf-card mcf-card-article ntv-ad-anchor"  style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000), url(https://placekitten.com/386/259);">
				<p class="recirculation-prefooter__personalization wds-font-size-s wds-font-weight-medium wds-leading-tight mcf-card-article__subtitle ntv-ad-label">AD · best buy</p>
				<p class="recirculation-prefooter__title wds-font-size-base wds-font-weight-bold wds-leading-tight mcf-card-article__title ntv-ad-title">Buy Opla: Very good Astra 1.0 TDI</p>
				<p class="recirculation-prefooter__subtitle wds-font-size-s wds-font-weight-medium wds-leading-tight mcf-card-article__subtitle ntv-ad-offer">Available from komis for $213.7</p>
			</a>`;
		} else {
			logger(logGroup, `No anchor found: #${NATIVO_FEED_AD_SLOT_NAME}`);
		}
	}

	private nativeIncontentTestDummy(): void {
		const nativeAdIncontentPlaceholder = document.getElementById(NATIVO_INCONTENT_AD_SLOT_NAME);

		if (nativeAdIncontentPlaceholder) {
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
		} else {
			logger(logGroup, `No anchor found: #${NATIVO_INCONTENT_AD_SLOT_NAME}`);
		}
	}
}

export const nativo = new Nativo();
