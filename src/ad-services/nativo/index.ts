import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';
import { AdSlot, context, DomListener, slotService, utils } from '@ad-engine/core';
import { getTopOffset, getViewportHeight, logger } from '../../ad-engine/utils';
import { Observable } from 'rxjs/dist/types';
import { filter, take, tap } from 'rxjs/operators';

const logGroup = 'nativo';
export const libraryUrl = 'https://s.ntv.io/serve/load.js';

export class Nativo {
	static INCONTENT_AD_SLOT_NAME = 'ntv_ad';
	static FEED_AD_SLOT_NAME = 'ntv_feed_ad';
	static SLOT_CLASS_LIST = ['ntv-ad', 'ad-slot'];
	static TEST_QUERY_STRING = 'native_ads_test';
	private readonly scrollThreshold: number;

	constructor() {
		this.scrollThreshold = context.get('events.pushOnScroll.nativoThreshold') || 200;
	}

	call(): Promise<void> {
		if (!this.isEnabled()) {
			utils.logger(logGroup, 'disabled');
			this.sendNativoLoadStatus(AdSlot.STATUS_COLLAPSE);

			return Promise.resolve();
		}

		return utils.scriptLoader
			.loadScript(libraryUrl, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				utils.logger(logGroup, 'ready');
				this.sendNativoLoadStatus(AdSlot.SLOT_ADDED_EVENT);
			});
	}

	private handleNativoNativeEvent(e, slot: AdSlot, adStatus: string) {
		utils.logger(logGroup, 'Nativo native event fired', e, adStatus);

		if (slot.getStatus() !== adStatus) {
			slot.setStatus(adStatus);
		} else {
			utils.logger(logGroup, 'Slot status already tracked', slot.getSlotName(), adStatus);
		}
	}

	isEnabled(): boolean {
		return context.get('services.nativo.enabled') && context.get('wiki.opts.enableNativeAds');
	}

	requestAd(placeholder: HTMLElement | null, uapLoadStatusAction: any = {}): void {
		if (!this.isEnabled()) {
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

		if (this.isSponsoredProductOnPage(uapLoadStatusAction)) {
			return;
		}

		utils.logger(logGroup, 'Sending an ad request to Nativo', placeholder.id);

		this.createAdSlot(placeholder.id);
		this.pushNativoQueue();
	}

	private createAdSlot(slotName: string): void {
		const slot = new AdSlot({ id: slotName });
		slot.setConfigProperty('trackEachStatus', true);

		slotService.add(slot);

		window.ntv.Events?.PubSub?.subscribe('noad', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_COLLAPSE);
		});

		window.ntv.Events?.PubSub?.subscribe('adRenderingComplete', (e) => {
			this.handleNativoNativeEvent(e, slot, AdSlot.STATUS_SUCCESS);
		});
	}

	private pushNativoQueue(): void {
		window.ntv.cmd.push(() => {
			window.PostRelease.Start();
		});
	}

	scrollTrigger(domListener: DomListener, action: UapLoadStatus) {
		const scroll: Observable<Event> = domListener.scroll$;
		scroll
			.pipe(
				filter(() => this.isThresholdExceeded()),
				take(1),
				tap(() => nativo.requestAd(document.getElementById(Nativo.INCONTENT_AD_SLOT_NAME), action)),
			)
			.subscribe();
	}

	private isThresholdExceeded(): boolean {
		const scrollPosition =
			window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
		const slotPosition: number = getTopOffset(
			document.getElementById(Nativo.INCONTENT_AD_SLOT_NAME),
		);
		const viewPortHeight: number = getViewportHeight();
		return scrollPosition + viewPortHeight > slotPosition - this.scrollThreshold;
	}

	replaceAndShowSponsoredFanAd(uapLoadStatusAction: any = {}): void {
		const nativoFeedAdSlotElement = document.getElementById(Nativo.FEED_AD_SLOT_NAME);
		const recirculationSponsoredElement = document.querySelector(
			'.recirculation-prefooter .recirculation-prefooter__item.is-sponsored.can-nativo-replace',
		);

		if (nativoFeedAdSlotElement && recirculationSponsoredElement) {
			if (!this.isSponsoredProductOnPage(uapLoadStatusAction)) {
				recirculationSponsoredElement.replaceWith(nativoFeedAdSlotElement);
				nativoFeedAdSlotElement.classList.remove('hide');
			}

			this.requestAd(nativoFeedAdSlotElement, uapLoadStatusAction);
		} else {
			utils.logger(logGroup, 'Could not replace sponsored element with Nativo feed ad');
		}
	}

	private isSponsoredProductOnPage(uapLoadStatusAction): boolean {
		if (uapLoadStatusAction?.isLoaded === true) {
			utils.logger(logGroup, 'Fan Takeover on the page');
			return true;
		}

		if (
			uapLoadStatusAction?.isLoaded === false &&
			uapLoadStatusAction?.adProduct === 'ruap' &&
			context.get('custom.hasFeaturedVideo')
		) {
			utils.logger(logGroup, '"Fan Takeover" on the featured page');
			return true;
		}

		return false;
	}

	private sendNativoLoadStatus(status: string, event?: any): void {
		const adLocation = event?.data[0].adLocation || '';
		const payload = {
			event: status,
			adSlotName: adLocation,
			payload: {
				adLocation: adLocation,
				provider: 'nativo',
			},
		};

		utils.logger(logGroup, `Dispatching status event`, payload, event);

		communicationService.dispatch(
			communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)(payload),
		);
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
