import { FOOTER, NAVBAR, PAGE } from '@platforms/shared';
import { TemplateDependency } from '@wikia/ad-engine';
import { DependencyContainer } from 'tsyringe';
import { F2Environment, F2_ENV } from '../../setup-f2';
import { F2State } from '../../utils/f2-state';
import { F2_STATE } from '../../utils/f2-state-binder';

export function registerF2UapDomElements(): TemplateDependency[] {
	return [
		{
			bind: NAVBAR,
			provider: (container: DependencyContainer) => {
				const f2Env: F2Environment = container.resolve(F2_ENV);

				return f2Env.isPageMobile
					? document.querySelector('.global-navigation-mobile-wrapper')
					: document.querySelector('.nav-bg-hack');
			},
		},
		{
			bind: PAGE,
			provider: (container: DependencyContainer) => {
				const state: F2State = container.resolve(F2_STATE);

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
