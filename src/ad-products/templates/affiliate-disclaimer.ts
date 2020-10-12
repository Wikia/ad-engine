import { utils } from '@ad-engine/core';

export class AffiliateDisclaimer {
	static getName(): string {
		return 'affiliateDisclaimer';
	}

	static getDefaultConfig(): object {
		return {};
	}

	constructor() {}

	init(): void {
		utils.logger(AffiliateDisclaimer.getName(), 'init');
		this.injectAffiliateDisclaimer();
	}

	private injectAffiliateDisclaimer(): void {
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
