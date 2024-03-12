import { TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerUcpDesktopUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.fandom-sticky-header') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.global-footer') },
	];
}
