import { Binder, context, DiProcess, Targeting, utils } from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

const SKIN = Symbol('targeting skin');

@Injectable()
export class MyPageTargetingSetup implements DiProcess {
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
		return {
			geo: utils.geoService.getCountryCode() || 'none',
			s0: 'ent',
			s2: 'other',
			skin: this.skin,
		};
	}
}
