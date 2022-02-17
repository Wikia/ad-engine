import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpMobileUapDomElements(): TemplateDependency[] {
	return [
		// ADEN-11573: Cleanup after switch
		{ bind: NAVBAR, value: document.querySelector('.mobile-global-navigation,#globalNavigation') },
		{ bind: PAGE, value: document.body },
		// ADEN-11573: Cleanup after switch
		{ bind: FOOTER, value: document.querySelector('.global-footer,.wds-global-footer') },
	];
}
