import { TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerUcpMobileUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.mobile-global-navigation') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.global-footer') },
	];
}
