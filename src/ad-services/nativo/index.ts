import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';
import { logger } from '../../ad-engine/utils';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo loaded',
	props<{ isLoaded: boolean }>(),
);

export class Nativo {
	static INCONTENT_AD_SLOT_NAME = 'ntv_ad';
	static FEED_AD_SLOT_NAME = 'ntv_feed_ad';
	static SLOT_CLASS_LIST = ['ntv-ad', 'ad-slot'];
	static TEST_QUERY_STRING = 'native_ads_test';

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
			});
	}

	isEnabled(): boolean {
		return (
			context.get('services.nativo.enabled') &&
			context.get('wiki.opts.enableNativeAds') &&
			this.checkCodePriority()
		);
	}

	checkCodePriority(): boolean {
		return (
			!context.get('custom.hasFeaturedVideo') &&
			!context.get('templates.stickyTlb.enabled') &&
			!context.get('templates.stickyTlb.forced')
		);
	}

	requestAd(placeholder: HTMLElement | null): void {
		if (!nativo.isEnabled()) {
			utils.logger(logGroup, 'Nativo is disabled');
			return;
		}

		if (utils.queryString.get(Nativo.TEST_QUERY_STRING) === '1') {
			utils.logger(logGroup, 'Displaying dummy test ads');
			this.displayTestAd();
			return;
		}

		if (!placeholder) {
			utils.logger(logGroup, 'Placeholder does not exist');
			return;
		}

		utils.logger(logGroup, 'Sending an ad request to Nativo');
		window.ntv.cmd.push(() => {
			window.PostRelease.Start();
		});
	}

	replaceAndShowSponsoredFanAd(): void {
		const nativoFeedAdSlotElement = document.getElementById(Nativo.FEED_AD_SLOT_NAME);
		const recirculationSponsoredElement = document.querySelector(
			'.recirculation-prefooter .recirculation-prefooter__item.is-sponsored.can-nativo-replace',
		);

		if (nativoFeedAdSlotElement && recirculationSponsoredElement) {
			recirculationSponsoredElement.replaceWith(nativoFeedAdSlotElement);
			nativoFeedAdSlotElement.classList.remove('hide');
			this.requestAd(nativoFeedAdSlotElement);
		} else {
			utils.logger(logGroup, 'Could not replace sponsored element with Nativo feed ad');
		}
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({ isLoaded: true }));
	}

	private displayTestAd(): void {
		if (utils.queryString.get(Nativo.TEST_QUERY_STRING) !== '1') {
			return;
		}

		this.nativeIncontentTestDummy();
		this.nativeFanFeedAdTestDummy();
	}

	private nativeFanFeedAdTestDummy(): void {
		const nativeAdFeedPlaceholder = document.getElementById(Nativo.FEED_AD_SLOT_NAME);

		if (!nativeAdFeedPlaceholder) {
			logger(logGroup, `No anchor found: #${Nativo.FEED_AD_SLOT_NAME}`);
			return;
		}

		nativeAdFeedPlaceholder.innerHTML = `<a href="https://bit.ly/NewFanLabRecirc" class="recirculation-prefooter__item-anchor recirculation-prefooter__sponsored mcf-card mcf-card-article ntv-ad-anchor"  style="background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), #000000), url(https://placekitten.com/386/259);">
			<p class="recirculation-prefooter__personalization wds-font-size-s wds-font-weight-medium wds-leading-tight mcf-card-article__subtitle ntv-ad-label">AD · best buy</p>
			<p class="recirculation-prefooter__title wds-font-size-base wds-font-weight-bold wds-leading-tight mcf-card-article__title ntv-ad-title">Buy Opla: Very good Astra 1.0 TDI</p>
			<p class="recirculation-prefooter__subtitle wds-font-size-s wds-font-weight-medium wds-leading-tight mcf-card-article__subtitle ntv-ad-offer">Available from komis for $213.7</p>
		</a>`;
	}

	private nativeIncontentTestDummy(): void {
		const nativeAdIncontentPlaceholder = document.getElementById(Nativo.INCONTENT_AD_SLOT_NAME);

		if (!nativeAdIncontentPlaceholder) {
			logger(logGroup, `No anchor found: #${Nativo.INCONTENT_AD_SLOT_NAME}`);
			return;
		}

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
	}
}

window.ntv = window.ntv || {};
window.ntv.cmd = window.ntv.cmd || [];

export const nativo = new Nativo();
