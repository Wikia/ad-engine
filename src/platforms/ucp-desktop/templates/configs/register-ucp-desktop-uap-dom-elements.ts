import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpDesktopUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.fandom-sticky-header') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.global-footer') },
	];
}
