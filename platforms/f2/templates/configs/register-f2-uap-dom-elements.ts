import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../setup-f2';
import { F2State } from '../../utils/f2-state';
import { F2_STATE } from '../../utils/f2-state-binder';

export function registerF2UapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			provider: (container: Container) => {
				const f2Env: F2Environment = container.get(F2_ENV);

				return f2Env.isPageMobile
					? document.querySelector('.global-navigation-mobile-wrapper')
					: document.querySelector('.wds-global-navigation-wrapper');
			},
		},
		{
			bind: PAGE,
			provider: (container: Container) => {
				const state: F2State = container.get(F2_STATE);

				return state.topOffset === null
					? document.querySelector('.article-layout.is-mobile-app-view') || document.body
					: document.body;
			},
		},
		{
			bind: FOOTER,
			value: document.querySelector('.wds-global-footer'),
		},
	];
}
