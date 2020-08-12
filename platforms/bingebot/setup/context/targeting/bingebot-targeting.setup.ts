import { TargetingSetup } from '@platforms/shared';
import { Binder, context, Dictionary, Targeting, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

const SKIN = Symbol('targeting skin');

@Injectable()
export class BingeBotTargetingSetup implements TargetingSetup {
	static skin(skin: string): Binder {
		return {
			bind: SKIN,
			value: skin,
		};
	}

	constructor(@Inject(SKIN) private skin: string) {}

	execute(): void {
		context.set('targeting', { ...context.get('targeting'), ...this.getPageLevelTargeting() });
	}

	getPageLevelTargeting(): Partial<Targeting> {
		const pageTargeting: Dictionary<string> = {
			geo: utils.geoService.getCountryCode() || 'none',
			s0: 'ent',
			s2: 'bingebot_selection',
			skin: this.skin,
		};

		const cid = utils.queryString.get('cid');

		if (cid !== undefined) {
			pageTargeting.cid = cid;
		}

		return pageTargeting;
	}
}
