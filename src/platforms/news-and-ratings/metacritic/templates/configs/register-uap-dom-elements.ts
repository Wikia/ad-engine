import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { context, TemplateDependency } from '@wikia/ad-engine';

export function registerUapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			value: context.get('state.isMobile')
				? document.getElementById('header')
				: document.getElementById('masthead'),
		},
		{
			bind: PAGE,
			value: document.body,
		},
		{
			bind: FOOTER,
			value: context.get('state.isMobile')
				? document.getElementById('footer')
				: document.getElementById('mastfoot'),
		},
	];
}
