import { TemplateStateHandler } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable({ autobind: false })
export class AffiliateDisclaimerUcpHandler implements TemplateStateHandler {
	constructor() {}

	async onEnter(): Promise<void> {
		const affiliateSlot = document.querySelector('#affiliate_slot');
		const legalDisclaimer = document.createElement('div');

		legalDisclaimer.id = 'affiliate_disclaimer';
		legalDisclaimer.innerText =
			'Fandom may earn an affiliate commission on sales made from links on this page.';

		if (affiliateSlot) {
			affiliateSlot.parentNode.insertBefore(legalDisclaimer, affiliateSlot.nextSibling);
		}
	}
}
