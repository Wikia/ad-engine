import { communicationService, globalAction, ofType } from '@ad-engine/communication';
import { context, utils } from '@ad-engine/core';
import { take } from 'rxjs/operators';
import { props } from 'ts-action';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';
export const nativoLoadedEvent = globalAction(
	'[AdEngine] Nativo loaded',
	props<{ isLoaded: boolean }>(),
);
const uapLoadStatus = globalAction('[AdEngine] UAP Load status', props<{ isLoaded: boolean }>());

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
		communicationService.action$.pipe(ofType(uapLoadStatus), take(1)).subscribe((action) => {
			if (!action.isLoaded) {
				const nativeAdIncontentPlaceholder = document.getElementById('ntv-ad');
				nativeAdIncontentPlaceholder.innerHTML = `<hr style="margin: 8px 0">
						<div class="ntv-wrapper">
							<img 
								src="https://placekitten.com/100/100" 
								alt="mr. mittens" 
								class="ntv-img" 
							/>
							<div class="ntv-content">
								<p>AD</p>
								<a href="https://fandom.com">Sprzedam opla</a>
								<p>Teraz</p>
							</div>
						</div>
					<hr style="margin: 8px 0 18px">`;
			}
		});
	}
}

export const nativo = new Nativo();
