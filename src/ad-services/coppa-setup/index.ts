import {
	BaseServiceSetup,
	context,
	GlobalContextCategories,
	globalContextService,
	utils,
} from '@ad-engine/core';

export class CoppaSetup extends BaseServiceSetup {
	call(): Promise<void> {
		let fallbackResolve;
		const fallback = new Promise<{ coppa: boolean }>((resolve) => {
			fallbackResolve = resolve;
		});
		const fallbackTimeout = setTimeout(() => {
			const directedAtChildren = !!window.fandomContext.site.directedAtChildren;
			globalContextService.setValue(GlobalContextCategories.partners, {
				blockthrough: {
					directedAtChildren: directedAtChildren,
				},
				directedAtChildren: directedAtChildren,
			});
			fallbackResolve({ coppa: directedAtChildren });
		}, context.get('options.coppaTimeout'));

		return Promise.race([window.ie.getRestrictions(), fallback]).then((value) => {
			clearTimeout(fallbackTimeout);
			utils.logger('coppa', 'COPPA status read', value.coppa);
		});
	}
}
