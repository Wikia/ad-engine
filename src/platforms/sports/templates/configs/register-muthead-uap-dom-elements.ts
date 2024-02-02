import { TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerMutheadUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.header') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.pre-footer__wrapper') },
	];
}
