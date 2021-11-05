import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo service',
	props<{ isLoaded: boolean }>(),
);

class Nativo {
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

	start(): void {
		if (utils.queryString.get('native_ads_test') === '1') {
			this.displayTestAd();
		} else {
			window.PostRelease.Start();
		}
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({ isLoaded: true }));
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	private displayTestAd(): void {
		const nativeAdIncontentPlaceholder = document.getElementById('ntv-ad');
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

export const nativo = new Nativo();
