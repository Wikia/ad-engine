import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.wds-global-navigation-wrapper') },
		{ bind: PAGE, value: document.body },
		{ bind: FOOTER, value: document.querySelector('.wds-global-footer') },
	];
}
