import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { context, TemplateDependency } from '@wikia/ad-engine';

export function registerFanCentralUapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			value: context.get('state.isMobile')
				? document.querySelector('.mobile-global-navigation__wrapper')
				: document.querySelector('.fandom-sticky-header'),
		},
		{
			bind: PAGE,
			value: document.body,
		},
		{
			bind: FOOTER,
			value: document.querySelector('.global-footer'),
		},
	];
}
