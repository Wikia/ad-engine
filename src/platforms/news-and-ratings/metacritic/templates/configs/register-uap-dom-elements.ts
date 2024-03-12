import { context, TemplateDependency } from '@ad-engine/core';
import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';

export function registerUapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			value: context.get('state.isMobile')
				? document.getElementById('header')
				: document.getElementById('top_header'),
		},
		{
			bind: PAGE,
			value: document.body,
		},
		{
			bind: FOOTER,
			value: context.get('state.isMobile')
				? document.getElementById('footer')
				: document.getElementById('bottom_footer'),
		},
	];
}
