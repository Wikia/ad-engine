export class HiviUapAb {
	constructor() {
		this.pageLink = 'templates/hivi-uap-ab/';
		this.lineItemId = '4878184759';
		this.aCreativeId = '138219923525';
		this.bCreativeId = '138252788741';
	}

	getUapCValue(slot) {
		let currentSlotParams;

		browser.waitUntil(() => {
			currentSlotParams = JSON.parse(slot.getAttribute('data-gpt-slot-params'));
			return !!currentSlotParams.uap_c;
		});

		return currentSlotParams.uap_c;
	}
}

export const hiviUapAb = new HiviUapAb();
