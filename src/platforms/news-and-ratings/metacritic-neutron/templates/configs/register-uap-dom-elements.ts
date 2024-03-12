import { TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerUapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			value: document.querySelector('header.c-siteHeader'),
		},
		{
			bind: PAGE,
			value: document.body,
		},
		{
			bind: FOOTER,
			value: document.querySelector('footer.c-siteFooter'),
		},
	];
}
