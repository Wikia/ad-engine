import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUcpHydraUapDomElements(): TemplateDependency[] {
	return [
		{ bind: NAVBAR, value: document.querySelector('#netbar') },
		{ bind: PAGE, value: document.querySelector('#global-wrapper') },
		{ bind: FOOTER, value: document.querySelector('#gamepedia-footer') },
	];
}
