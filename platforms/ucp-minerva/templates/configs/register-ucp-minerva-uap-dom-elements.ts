import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpMinervaUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('.header-container') },
		{ bind: PAGE, value: document.querySelector('#content') },
		{ bind: FOOTER, value: document.querySelector('.minerva-footer') },
	];
}
