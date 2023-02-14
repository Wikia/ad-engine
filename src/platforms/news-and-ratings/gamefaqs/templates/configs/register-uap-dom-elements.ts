import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';

export function registerUapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			value: document.querySelector('.masthead'),
		},
		{
			bind: PAGE,
			value: document.body,
		},
		{
			bind: FOOTER,
			value: document.getElementById('footer'),
		},
	];
}
