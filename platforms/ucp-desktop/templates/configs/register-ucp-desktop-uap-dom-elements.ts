import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpDesktopUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.global-navigation') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.wds-global-footer') },
	];
}
