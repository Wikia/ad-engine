import { TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerFutheadUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.navbar.navbar-futhead') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.global-footer__wrapper') },
	];
}
