import { communicationService, globalAction } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { props } from 'ts-action';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo loaded',
	props<{ isLoaded: boolean }>(),
);

class Nativo {
	call(): Promise<void> {
		if (!this.isEnabled() && false) {
			utils.logger(logGroup, 'disabled');

			return Promise.resolve();
		}

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				utils.logger(logGroup, 'ready');
				this.sendEvent();
				this.displayTestAd();
			});
	}

	private sendEvent(): void {
		communicationService.dispatch(nativoLoadedEvent({ isLoaded: true }));
	}

	private isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	private displayTestAd(): void {
		if (utils.queryString.get('native_ads') !== '1') {
			return;
		}

		const nativeAdIncontentPlaceholder = document.getElementById('ntv-ad');
		nativeAdIncontentPlaceholder.innerHTML = `<hr style="margin: 8px 0">
					<div class="ntv-title"></div>
						<div class="ntv-content" style="display: flex">
							<img 
								src="https://placekitten.com/100/100" 
								alt="mr. mittens" 
								style="width: 100px; height: 100px"/>
							<div style="margin: 0 8px">
								<p style="margin-bottom: 0">AD</p>
								<a href="https://fandom.com" style="margin: 8px 0; font-size: 24px">Sprzedam opla</a>
								<p style="margin-bottom: 0">Teraz</p>
							</div>
						</div>
				</div>
			<hr style="margin: 8px 0 18px">`;
	}
}

export const nativo = new Nativo();
