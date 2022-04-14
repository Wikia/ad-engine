import { communicationService, eventsRepository, UapLoadStatus } from '@ad-engine/communication';

import { AdSlot } from '../../models';
import { Context, slotService } from '../../services';
import { scriptLoader, logger } from '../../utils';

const logGroup = 'nativo';
const NATIVO_LIBRARY_URL = '//s.ntv.io/serve/load.js';

export class Nativo {
	static INCONTENT_AD_SLOT_NAME = 'ntv_ad';
	static FEED_AD_SLOT_NAME = 'ntv_feed_ad';

	private static AD_SLOT_MAP = {
		1142863: Nativo.INCONTENT_AD_SLOT_NAME,
		1142668: Nativo.FEED_AD_SLOT_NAME,
		1142669: Nativo.FEED_AD_SLOT_NAME,
	};

	constructor(protected context: Context) {}

	isEnabled() {
		const isEnabled =
			this.context.get('services.nativo.enabled') && this.context.get('wiki.opts.enableNativeAds');

		Nativo.log('Is Nativo enabled?', isEnabled);

		return isEnabled;
	}

	load() {
		Nativo.log('Loading Nativo API...');

		scriptLoader
			.loadScript(NATIVO_LIBRARY_URL, 'text/javascript', true, null, {}, { ntvSetNoAutoStart: '' })
			.then(() => {
				Nativo.log('Nativo API loaded.');
				this.watchNtvEvents();
				this.sendNativoLoadStatus(AdSlot.SLOT_ADDED_EVENT);
			});
	}

	scrollTriggerCallback(action: UapLoadStatus, slotName: string) {
		if (action.isLoaded) {
			Nativo.log(logGroup, 'Fan Takeover on the page');
			return;
		}

		if (
			action.isLoaded === false &&
			action.adProduct === 'ruap' &&
			this.context.get('custom.hasFeaturedVideo')
		) {
			Nativo.log(logGroup, '"Fan Takeover" on the featured page');
			return;
		}

		if (this.context.get(`slots.${slotName}.disabled`) === true) {
			Nativo.log(logGroup, `Slot disabled: ${slotName}`);

			// the Nativo ad server responses with a JS that searches for specific IDs that's why the removal here
			if (this.context.get('targeting.skin') !== 'ucp_mobile') {
				document.getElementById(slotName).id = '';
			} else {
				// on mobile the slots are injected before we know they're disabled, so we need to remove the node
				document.getElementById(slotName).remove();
			}

			return;
		}

		this.context.push('state.adStack', { id: slotName });
	}

	replaceAndShowSponsoredFanAd(): void {
		const nativoFeedAdSlotElement = document.getElementById(Nativo.FEED_AD_SLOT_NAME);
		const recirculationSponsoredElement = document.querySelector(
			'.recirculation-prefooter__item.is-sponsored.can-nativo-replace',
		);

		if (nativoFeedAdSlotElement && recirculationSponsoredElement) {
			recirculationSponsoredElement.replaceWith(nativoFeedAdSlotElement);
			Nativo.log('Replacing sponsored element with Nativo feed ad');
		} else {
			Nativo.log('Could not replace sponsored element with Nativo feed ad');
		}
	}

	static log(...logValues) {
		logger(logGroup, ...logValues);
	}

	private sendNativoLoadStatus(status: string): void {
		const payload = {
			event: status,
			adSlotName: '',
			payload: {
				adLocation: '',
				provider: 'nativo',
			},
		};

		communicationService.dispatch(
			communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)(payload),
		);
	}

	private watchNtvEvents(): void {
		window.ntv.Events?.PubSub?.subscribe('noad', (e: NativoNoAdEvent) => {
			const slotName = Nativo.AD_SLOT_MAP[e.data[0].id];
			this.handleNtvNativeEvent(e, slotName, AdSlot.STATUS_COLLAPSE); // init or collapse
		});

		window.ntv.Events?.PubSub?.subscribe('adRenderingComplete', (e: NativoCompleteEvent) => {
			const slotName = Nativo.AD_SLOT_MAP[e.data.placement];
			this.handleNtvNativeEvent(e, slotName, AdSlot.STATUS_SUCCESS);
		});
	}

	private handleNtvNativeEvent(
		e: NativoNoAdEvent | NativoCompleteEvent,
		slotName: string,
		adStatus: string,
	) {
		const slot = slotService.get(slotName);

		Nativo.log('Nativo native event fired', e, adStatus, slotName, slot);

		if (!slot || slot.getSlotName() !== slotName) return;

		if (adStatus === AdSlot.STATUS_COLLAPSE) {
			slot.hide();
		}

		if (adStatus === AdSlot.STATUS_SUCCESS && slotName === Nativo.FEED_AD_SLOT_NAME) {
			this.replaceAndShowSponsoredFanAd();
		}

		if (slot.getStatus() !== adStatus) {
			slot.setStatus(adStatus);
		} else {
			Nativo.log('Slot status already tracked', slot.getSlotName(), adStatus);
		}
	}
}
