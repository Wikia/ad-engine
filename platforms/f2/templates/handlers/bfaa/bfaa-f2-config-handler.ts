import {
	context,
	TEMPLATE,
	TemplateStateHandler,
	UapParams,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';
import { F2_ENV, F2Environment } from '../../../setup-f2';

@Injectable({ autobind: false })
export class BfaaF2ConfigHandler implements TemplateStateHandler {
	constructor(
		@Inject(TEMPLATE.PARAMS) private params: UapParams,
		@Inject(F2_ENV) private f2Env: F2Environment,
	) {}

	async onEnter(): Promise<void> {
		const enabledSlots: string[] = [
			'top_boxad',
			'bottom_leaderboard',
			'incontent_boxad',
			'feed_boxad',
		];
		universalAdPackage.init(
			this.params,
			enabledSlots,
			Object.keys(context.get('slots') || []).filter(
				(slotName) => !enabledSlots.includes(slotName),
			),
		);
		context.set('slots.bottom_leaderboard.viewportConflicts', []);
		context.set('slots.bottom_leaderboard.sizes', []);
		context.set(
			'slots.bottom_leaderboard.defaultSizes',
			this.f2Env.siteType === 'app' ? [[2, 2]] : [[3, 3]],
		);
	}

	async onLeave(): Promise<void> {}
}
